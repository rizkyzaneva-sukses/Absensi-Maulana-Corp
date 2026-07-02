import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const databaseUrl = process.env.DATABASE_URL;
const port = Number(process.env.PORT || 3000);

if (!databaseUrl) {
  console.error('DATABASE_URL wajib diisi agar sinkronisasi PostgreSQL dapat berjalan.');
  process.exit(1);
}

const memoryDatabase = databaseUrl === 'memory://';
let Pool = pg.Pool;
let Client = pg.Client;

if (memoryDatabase) {
  const { newDb } = await import('pg-mem');
  const memory = newDb({ autoCreateForeignKeyIndices: true });
  const adapter = memory.adapters.createPg();
  Pool = adapter.Pool;
  Client = adapter.Client;
}

const databaseConfig = memoryDatabase
  ? {}
  : {
      connectionString: databaseUrl,
      max: Number(process.env.PGPOOL_MAX || 10),
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    };

const pool = new Pool(databaseConfig);
const app = express();
const eventClients = new Set();
let listenerClient;
let listenerRetryTimer;

const collections = {
  attendances: { table: 'app_sync_attendance_records', apiPath: 'attendances' },
  leaveRequests: { table: 'app_sync_leave_requests', apiPath: 'leave-requests' },
  overtimeRequests: { table: 'app_sync_overtime_requests', apiPath: 'overtime-requests' },
  corrections: { table: 'app_sync_attendance_corrections', apiPath: 'corrections' },
};

function sendEvent(payload) {
  const message = `event: sync\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const response of eventClients) response.write(message);
}

async function publishChange(collection, id = null) {
  const payload = JSON.stringify({ collection, id, at: new Date().toISOString() });
  if (memoryDatabase) {
    sendEvent(JSON.parse(payload));
    return;
  }
  await pool.query("SELECT pg_notify('attendance_changes', $1)", [payload]);
}

async function connectChangeListener() {
  if (memoryDatabase) return;
  clearTimeout(listenerRetryTimer);
  try {
    listenerClient = new Client(databaseConfig);
    await listenerClient.connect();
    await listenerClient.query('LISTEN attendance_changes');
    listenerClient.on('notification', (message) => {
      try {
        sendEvent(JSON.parse(message.payload || '{}'));
      } catch {
        sendEvent({ collection: 'all', at: new Date().toISOString() });
      }
    });
    listenerClient.on('error', (error) => {
      console.error('Koneksi realtime PostgreSQL terputus:', error.message);
      listenerClient = undefined;
      listenerRetryTimer = setTimeout(connectChangeListener, 5_000);
    });
  } catch (error) {
    console.error('Belum dapat membuka kanal realtime PostgreSQL:', error.message);
    listenerClient = undefined;
    listenerRetryTimer = setTimeout(connectChangeListener, 5_000);
  }
}

async function initializeDatabase() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(schema);
  await pool.query(
    `INSERT INTO app_sync_metadata (key, value)
     VALUES ('instance_id', $1)
     ON CONFLICT (key) DO NOTHING`,
    [crypto.randomUUID()],
  );
}

async function getInstanceId() {
  const result = await pool.query("SELECT value FROM app_sync_metadata WHERE key = 'instance_id'");
  return result.rows[0]?.value;
}

async function listCollection(table) {
  const result = await pool.query(
    `SELECT payload
     FROM ${table}
     ORDER BY COALESCE(payload->>'date', payload->>'created_at') DESC NULLS LAST, updated_at DESC`,
  );
  return result.rows.map((row) => row.payload);
}

async function importCollection(client, table, records) {
  if (!Array.isArray(records) || records.length === 0) return;

  const validRecords = records.filter((record) =>
    record?.id && record?.company_id && record?.employee_id &&
    (table !== 'app_sync_attendance_records' || record?.date),
  );

  for (let start = 0; start < validRecords.length; start += 500) {
    const batch = validRecords.slice(start, start + 500);
    const values = [];
    const parameters = [];

    for (const record of batch) {
      if (table === 'app_sync_attendance_records') {
        const offset = parameters.length;
        parameters.push(
          record.id,
          record.company_id,
          record.employee_id,
          record.date,
          JSON.stringify(record),
        );
        values.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}::date, $${offset + 5}::jsonb)`);
      } else {
        const offset = parameters.length;
        parameters.push(record.id, record.company_id, record.employee_id, JSON.stringify(record));
        values.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}::jsonb)`);
      }
    }

    const columns = table === 'app_sync_attendance_records'
      ? '(id, company_id, employee_id, attendance_date, payload)'
      : '(id, company_id, employee_id, payload)';
    await client.query(
      `INSERT INTO ${table} ${columns} VALUES ${values.join(', ')} ON CONFLICT DO NOTHING`,
      parameters,
    );
  }
}

async function upsertRecord(table, record) {
  if (!record?.id || !record?.company_id || !record?.employee_id) {
    const error = new Error('Data wajib memiliki id, company_id, dan employee_id.');
    error.status = 400;
    throw error;
  }

  if (table === 'app_sync_attendance_records') {
    if (!record.date) {
      const error = new Error('Data absensi wajib memiliki tanggal.');
      error.status = 400;
      throw error;
    }
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      let result = await client.query(
        `SELECT payload FROM app_sync_attendance_records
         WHERE company_id = $1 AND employee_id = $2 AND attendance_date = $3::date
         FOR UPDATE`,
        [record.company_id, record.employee_id, record.date],
      );

      if (result.rowCount === 0) {
        result = await client.query(
          `INSERT INTO app_sync_attendance_records (id, company_id, employee_id, attendance_date, payload)
           VALUES ($1, $2, $3, $4::date, $5::jsonb)
           ON CONFLICT DO NOTHING
           RETURNING payload`,
          [record.id, record.company_id, record.employee_id, record.date, JSON.stringify(record)],
        );
      }

      if (result.rowCount === 0) {
        result = await client.query(
          `SELECT payload FROM app_sync_attendance_records
           WHERE company_id = $1 AND employee_id = $2 AND attendance_date = $3::date`,
          [record.company_id, record.employee_id, record.date],
        );
      }

      await client.query('COMMIT');
      return result.rows[0].payload;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  const result = await pool.query(
    `INSERT INTO ${table} (id, company_id, employee_id, payload)
     VALUES ($1, $2, $3, $4::jsonb)
     ON CONFLICT (id)
     DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()
     RETURNING payload`,
    [record.id, record.company_id, record.employee_id, JSON.stringify(record)],
  );
  return result.rows[0].payload;
}

async function patchRecord(table, id, changes) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const existing = await client.query(
      `SELECT payload FROM ${table} WHERE id = $1 FOR UPDATE`,
      [id],
    );
    if (existing.rowCount === 0) {
      const error = new Error('Data tidak ditemukan.');
      error.status = 404;
      throw error;
    }

    const payload = { ...existing.rows[0].payload, ...(changes || {}), id };
    const result = await client.query(
      `UPDATE ${table}
       SET payload = $2::jsonb, updated_at = NOW()
       WHERE id = $1
       RETURNING payload`,
      [id, JSON.stringify(payload)],
    );
    await client.query('COMMIT');
    return result.rows[0].payload;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

app.disable('x-powered-by');
app.use(express.json({ limit: '50mb' }));
app.use((request, response, next) => {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Referrer-Policy', 'same-origin');
  next();
});

app.get('/api/health', async (_request, response, next) => {
  try {
    await pool.query('SELECT 1');
    response.json({ ok: true, instanceId: await getInstanceId() });
  } catch (error) {
    next(error);
  }
});

app.get('/api/sync', async (_request, response, next) => {
  try {
    const [attendances, leaveRequests, overtimeRequests, corrections] = await Promise.all([
      listCollection(collections.attendances.table),
      listCollection(collections.leaveRequests.table),
      listCollection(collections.overtimeRequests.table),
      listCollection(collections.corrections.table),
    ]);
    response.json({ attendances, leaveRequests, overtimeRequests, corrections });
  } catch (error) {
    next(error);
  }
});

app.post('/api/sync/import', async (request, response, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const [name, config] of Object.entries(collections)) {
      await importCollection(client, config.table, request.body?.[name]);
    }
    await client.query('COMMIT');
    await publishChange('all');
    response.status(201).json({ ok: true });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
});

for (const [name, config] of Object.entries(collections)) {
  app.post(`/api/${config.apiPath}`, async (request, response, next) => {
    try {
      const saved = await upsertRecord(config.table, request.body);
      await publishChange(name, saved.id);
      response.status(201).json(saved);
    } catch (error) {
      next(error);
    }
  });

  app.patch(`/api/${config.apiPath}/:id`, async (request, response, next) => {
    try {
      const saved = await patchRecord(config.table, request.params.id, request.body);
      await publishChange(name, request.params.id);
      response.json(saved);
    } catch (error) {
      next(error);
    }
  });
}

app.get('/api/events', (request, response) => {
  response.setHeader('Content-Type', 'text/event-stream');
  response.setHeader('Cache-Control', 'no-cache, no-transform');
  response.setHeader('Connection', 'keep-alive');
  response.flushHeaders();
  response.write(`event: ready\ndata: ${JSON.stringify({ at: new Date().toISOString() })}\n\n`);
  eventClients.add(response);
  request.on('close', () => eventClients.delete(response));
});

app.use('/api', (_request, response) => {
  response.status(404).json({ error: 'Endpoint API tidak ditemukan.' });
});

app.use(express.static(distDir, {
  index: false,
  maxAge: '1y',
  immutable: true,
  setHeaders(response, filePath) {
    if (filePath.endsWith('index.html')) response.setHeader('Cache-Control', 'no-cache');
  },
}));

app.use((_request, response) => {
  response.setHeader('Cache-Control', 'no-cache');
  response.sendFile(path.join(distDir, 'index.html'));
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(error.status || 500).json({
    error: error.status ? error.message : 'Terjadi kesalahan pada server.',
  });
});

await initializeDatabase();
await connectChangeListener();

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Absensi API berjalan pada port ${port}.`);
});

const heartbeat = setInterval(() => {
  for (const response of eventClients) response.write(': keep-alive\n\n');
}, 25_000);

async function shutdown() {
  clearInterval(heartbeat);
  clearTimeout(listenerRetryTimer);
  server.close();
  if (listenerClient) await listenerClient.end().catch(() => {});
  await pool.end();
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
