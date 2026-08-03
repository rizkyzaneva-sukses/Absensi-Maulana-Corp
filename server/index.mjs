import 'dotenv/config';
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
const allowedOrigin = process.env.ALLOWED_ORIGIN || null;

const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;

if (!telegramBotToken) {
  console.warn('TELEGRAM_BOT_TOKEN belum dikonfigurasi. Fitur reset password via Telegram tidak akan berfungsi.');
}

// Send message via Telegram Bot API
async function sendTelegramMessage(chatId, text) {
  if (!telegramBotToken) throw new Error('Telegram bot belum dikonfigurasi.');
  const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
  const data = await res.json();
  if (!data.ok) {
    throw new Error(data.description || 'Gagal mengirim pesan Telegram.');
  }
  return data;
}

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
  employees: { table: 'app_sync_employees', apiPath: 'employees' },
};

// app_sync_employees rows describe an employee itself rather than a record that
// belongs to one, so there's no separate "owning employee" — use the row's own id.
function resolveRecordEmployeeId(table, record) {
  return table === 'app_sync_employees' ? record?.id : record?.employee_id;
}

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

  const MAX_IMPORT_SIZE = 5000;
  if (records.length > MAX_IMPORT_SIZE) {
    const error = new Error(`Import terlalu besar. Maksimal ${MAX_IMPORT_SIZE} record per koleksi.`);
    error.status = 400;
    throw error;
  }

  const validRecords = records.filter((record) => {
    if (!record?.id || !record?.company_id || !resolveRecordEmployeeId(table, record)) return false;
    if (table === 'app_sync_attendance_records' && !record?.date) return false;
    // Basic type validation
    if (typeof record.id !== 'string' || typeof record.company_id !== 'string') return false;
    if (record.id.length > 100 || record.company_id.length > 100) return false;
    return true;
  });

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
        parameters.push(record.id, record.company_id, resolveRecordEmployeeId(table, record), JSON.stringify(record));
        values.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}::jsonb)`);
      }
    }

    const columns = table === 'app_sync_attendance_records'
      ? '(id, company_id, employee_id, attendance_date, payload)'
      : '(id, company_id, employee_id, payload)';
      if (table === 'app_sync_attendance_records') {
        // Upgrade TIDAK_HADIR / empty check-in when importing real check-ins
        await client.query(
          `INSERT INTO ${table} ${columns} VALUES ${values.join(', ')}
           ON CONFLICT (company_id, employee_id, attendance_date) DO UPDATE SET
             payload = CASE
               WHEN (app_sync_attendance_records.payload->>'check_in_time') IS NULL
                 OR (app_sync_attendance_records.payload->>'check_in_time') = ''
                 OR (app_sync_attendance_records.payload->>'status') = 'TIDAK_HADIR'
               THEN EXCLUDED.payload
               ELSE app_sync_attendance_records.payload
             END,
             updated_at = CASE
               WHEN (app_sync_attendance_records.payload->>'check_in_time') IS NULL
                 OR (app_sync_attendance_records.payload->>'check_in_time') = ''
                 OR (app_sync_attendance_records.payload->>'status') = 'TIDAK_HADIR'
               THEN NOW()
               ELSE app_sync_attendance_records.updated_at
             END`,
          parameters,
        );
      } else {
        await client.query(
          `INSERT INTO ${table} ${columns} VALUES ${values.join(', ')} ON CONFLICT DO NOTHING`,
          parameters,
        );
      }
  }
}

async function upsertRecord(table, record) {
  const employeeId = resolveRecordEmployeeId(table, record);
  if (!record?.id || !record?.company_id || !employeeId) {
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
        `SELECT id, payload FROM app_sync_attendance_records
         WHERE company_id = $1 AND employee_id = $2 AND attendance_date = $3::date
         FOR UPDATE`,
        [record.company_id, record.employee_id, record.date],
      );

      if (result.rowCount > 0) {
        const existing = result.rows[0].payload || {};
        const canUpgrade =
          !existing.check_in_time ||
          existing.status === 'TIDAK_HADIR' ||
          (record.check_in_time && !existing.check_in_time);

        if (canUpgrade && record.check_in_time) {
          const merged = {
            ...existing,
            ...record,
            id: existing.id || result.rows[0].id,
            check_out_time: record.check_out_time ?? existing.check_out_time ?? null,
          };
          result = await client.query(
            `UPDATE app_sync_attendance_records
             SET payload = $2::jsonb, updated_at = NOW()
             WHERE id = $1
             RETURNING payload`,
            [result.rows[0].id, JSON.stringify(merged)],
          );
        } else {
          result = { rowCount: 1, rows: [{ payload: existing }] };
        }
      } else {
        result = await client.query(
          `INSERT INTO app_sync_attendance_records (id, company_id, employee_id, attendance_date, payload)
           VALUES ($1, $2, $3, $4::date, $5::jsonb)
           ON CONFLICT DO NOTHING
           RETURNING payload`,
          [record.id, record.company_id, record.employee_id, record.date, JSON.stringify(record)],
        );

        if (result.rowCount === 0) {
          result = await client.query(
            `SELECT payload FROM app_sync_attendance_records
             WHERE company_id = $1 AND employee_id = $2 AND attendance_date = $3::date`,
            [record.company_id, record.employee_id, record.date],
          );
        }
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
    [record.id, record.company_id, employeeId, JSON.stringify(record)],
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
app.use(express.json({ limit: '10mb' }));
app.use((request, response, next) => {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Referrer-Policy', 'same-origin');
  // CORS
  const origin = request.headers.origin;
  if (origin) {
    if (!allowedOrigin || origin === allowedOrigin) {
      response.setHeader('Access-Control-Allow-Origin', origin);
    }
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');
    response.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  if (request.method === 'OPTIONS') return response.sendStatus(204);
  next();
});

// Rate limiter (simple in-memory)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 120;
function rateLimit(request, response, next) {
  const key = request.ip || request.socket.remoteAddress;
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(key, { start: now, count: 1 });
    return next();
  }
  entry.count += 1;
  if (entry.count > RATE_LIMIT_MAX) {
    return response.status(429).json({ error: 'Terlalu banyak permintaan. Coba lagi nanti.' });
  }
  next();
}
app.use(rateLimit);

// API Key auth (optional — skipped if API_KEY not set)
const apiKey = process.env.API_KEY;
if (apiKey) {
  app.use('/api', (request, response, next) => {
    // Skip auth for health check, SSE events, and (unauthenticated) password reset
    if (request.path === '/health' || request.path === '/events' || request.path.startsWith('/auth/password-reset/') || request.path.startsWith('/telegram/')) {
      return next();
    }
    const provided = request.headers['x-api-key'];
    if (provided !== apiKey) {
      return response.status(401).json({ error: 'API key tidak valid atau tidak diberikan.' });
    }
    next();
  });
}

// Password reset via email code (in-memory, single-instance store)
const passwordResetStore = new Map();
const RESET_CODE_TTL_MS = 10 * 60 * 1000;
const RESET_CODE_MAX_ATTEMPTS = 5;
const RESET_REQUEST_COOLDOWN_MS = 60 * 1000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hashResetCode(code) {
  return crypto.createHash('sha256').update(code).digest('hex');
}

function generateResetCode() {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
}

app.post('/api/auth/password-reset/request', async (request, response, next) => {
  try {
    const email = String(request.body?.email || '').trim().toLowerCase();
    const telegramChatId = String(request.body?.telegram_chat_id || '').trim();
    if (!EMAIL_REGEX.test(email)) {
      return response.status(400).json({ error: 'Format email tidak valid.' });
    }

    const now = Date.now();
    const existing = passwordResetStore.get(email);
    if (existing && now - existing.lastSentAt < RESET_REQUEST_COOLDOWN_MS) {
      return response.status(429).json({ error: 'Tunggu sebentar sebelum meminta kode baru.' });
    }

    if (!telegramBotToken) {
      console.error('Permintaan reset password gagal: Telegram bot belum dikonfigurasi.');
      return response.status(500).json({ error: 'Layanan Telegram belum dikonfigurasi di server.' });
    }

    if (!telegramChatId) {
      return response.status(400).json({ error: 'Akun Anda belum terhubung dengan Telegram. Hubungi admin.' });
    }

    const code = generateResetCode();
    passwordResetStore.set(email, {
      codeHash: hashResetCode(code),
      expiresAt: now + RESET_CODE_TTL_MS,
      attempts: 0,
      lastSentAt: now,
    });

    const message = `🔐 <b>Kode Reset Password</b>\n\nKode verifikasi Anda: <code>${code}</code>\n\nKode berlaku selama 10 menit.\nAbaikan pesan ini jika Anda tidak meminta reset password.`;

    await sendTelegramMessage(telegramChatId, message);

    response.json({ ok: true, message: 'Kode verifikasi telah dikirim ke Telegram Anda.' });
  } catch (error) {
    next(error);
  }
});

app.post('/api/auth/password-reset/verify', (request, response) => {
  const email = String(request.body?.email || '').trim().toLowerCase();
  const code = String(request.body?.code || '').trim();

  const entry = passwordResetStore.get(email);
  if (!entry || Date.now() > entry.expiresAt) {
    passwordResetStore.delete(email);
    return response.status(400).json({ error: 'Kode tidak valid atau sudah kedaluwarsa.' });
  }

  if (entry.attempts >= RESET_CODE_MAX_ATTEMPTS) {
    passwordResetStore.delete(email);
    return response.status(429).json({ error: 'Terlalu banyak percobaan. Minta kode baru.' });
  }

  entry.attempts += 1;

  if (hashResetCode(code) !== entry.codeHash) {
    return response.status(400).json({ error: 'Kode salah.' });
  }

  passwordResetStore.delete(email);
  response.json({ ok: true });
});

// ─── Telegram Connect Flow ───────────────────────────────────────────
// Employee clicks "Connect Telegram" → gets a token → opens bot link →
// bot receives /start TOKEN → saves chat_id → done.

app.post('/api/telegram/connect', async (request, response, next) => {
  try {
    if (!telegramBotToken) {
      console.error('Connect Telegram gagal: TELEGRAM_BOT_TOKEN belum dikonfigurasi.');
      return response.status(500).json({ error: 'Layanan Telegram belum dikonfigurasi di server. Hubungi admin untuk mengatur TELEGRAM_BOT_TOKEN.' });
    }

    const employeeId = String(request.body?.employee_id || '').trim();
    if (!employeeId) {
      return response.status(400).json({ error: 'employee_id wajib diisi.' });
    }

    // Invalidate any old pending connections for this employee
    await pool.query(
      `DELETE FROM telegram_connections WHERE employee_id = $1 AND chat_id IS NULL`,
      [employeeId],
    );

    const connectToken = crypto.randomBytes(16).toString('hex');
    await pool.query(
      `INSERT INTO telegram_connections (employee_id, connect_token) VALUES ($1, $2)`,
      [employeeId, connectToken],
    );

    const botUsername = await getBotUsername();
    const telegramLink = `https://t.me/${botUsername}?start=${connectToken}`;

    response.json({ ok: true, token: connectToken, telegram_link: telegramLink });
  } catch (error) {
    next(error);
  }
});

app.get('/api/telegram/connect-status', async (request, response, next) => {
  try {
    const token = String(request.query?.token || '').trim();
    if (!token) {
      return response.status(400).json({ error: 'Token wajib diisi.' });
    }

    const result = await pool.query(
      `SELECT chat_id, connected_at FROM telegram_connections WHERE connect_token = $1`,
      [token],
    );

    if (result.rowCount === 0) {
      return response.status(404).json({ error: 'Token tidak valid.' });
    }

    const row = result.rows[0];
    if (row.chat_id) {
      response.json({ ok: true, connected: true, chat_id: row.chat_id });
    } else {
      response.json({ ok: true, connected: false });
    }
  } catch (error) {
    next(error);
  }
});

// Telegram Bot Webhook — receives /start TOKEN from users
app.post('/api/telegram/webhook', async (request, response) => {
  try {
    const update = request.body;
    const message = update.message || update.my_chat_member;
    if (!message) return response.json({ ok: true });

    const chatId = String(message.chat?.id || '');
    const text = String(message.text || '').trim();
    const firstName = message.from?.first_name || 'User';

    // Handle /start TOKEN
    if (text.startsWith('/start ')) {
      const token = text.slice(7).trim();
      const result = await pool.query(
        `UPDATE telegram_connections
         SET chat_id = $1, connected_at = NOW()
         WHERE connect_token = $2 AND chat_id IS NULL
         RETURNING employee_id`,
        [chatId, token],
      );

      if (result.rowCount > 0) {
        await sendTelegramMessage(chatId, `✅ <b>Telegram berhasil terhubung!</b>\n\nHalo ${firstName}, akun Anda sudah terhubung dengan sistem absensi.\nSekarang Anda bisa mereset password via Telegram.`);
      } else {
        await sendTelegramMessage(chatId, `⚠️ Token tidak valid atau sudah digunakan.`);
      }
    } else if (text === '/start') {
      await sendTelegramMessage(chatId, `👋 Halo ${firstName}!\n\nGunakan link dari aplikasi absensi untuk menghubungkan akun Anda.\n\nKetik /help untuk bantuan.`);
    } else if (text === '/help') {
      await sendTelegramMessage(chatId, `📖 <b>Bantuan</b>\n\nUntuk menghubungkan akun:\n1. Buka aplikasi absensi\n2. Klik "Connect Telegram"\n3. Klik link yang muncul\n4. Klik "Start" di sini\n\nUntuk reset password:\n1. Klik "Lupa Password" di login\n2. Masukkan email Anda\n3. Kode akan dikirim ke Telegram ini`);
    }

    response.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    response.json({ ok: true }); // Always return 200 to Telegram
  }
});

// Helper: get bot username (cached)
let cachedBotUsername = null;
async function getBotUsername() {
  if (cachedBotUsername) return cachedBotUsername;
  const res = await fetch(`https://api.telegram.org/bot${telegramBotToken}/getMe`);
  const data = await res.json();
  if (data.ok) {
    cachedBotUsername = data.result.username;
    return cachedBotUsername;
  }
  throw new Error('Gagal mendapatkan info bot Telegram.');
}

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
    const [attendances, leaveRequests, overtimeRequests, corrections, employees] = await Promise.all([
      listCollection(collections.attendances.table),
      listCollection(collections.leaveRequests.table),
      listCollection(collections.overtimeRequests.table),
      listCollection(collections.corrections.table),
      listCollection(collections.employees.table),
    ]);
    response.json({ attendances, leaveRequests, overtimeRequests, corrections, employees });
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

  app.delete(`/api/${config.apiPath}/:id`, async (request, response, next) => {
    try {
      await pool.query(`DELETE FROM ${config.table} WHERE id = $1`, [request.params.id]);
      await publishChange(name, request.params.id);
      response.status(204).end();
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

// Browser fetches can't read process.env, so the (already non-secret — it only
// gates a public SPA's own API) API_KEY is inlined into the HTML shell it serves.
let indexHtmlTemplate = null;
function renderIndexHtml() {
  if (indexHtmlTemplate === null) {
    indexHtmlTemplate = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
  }
  if (!apiKey) return indexHtmlTemplate;
  const inject = `<script>window.__API_KEY__=${JSON.stringify(apiKey)};</script>`;
  return indexHtmlTemplate.includes('</head>')
    ? indexHtmlTemplate.replace('</head>', `${inject}</head>`)
    : inject + indexHtmlTemplate;
}

app.use((_request, response) => {
  response.setHeader('Cache-Control', 'no-cache');
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.send(renderIndexHtml());
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
