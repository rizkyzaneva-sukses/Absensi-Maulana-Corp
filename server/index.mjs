import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import pg from 'pg';
import {
  buildMorningReport,
  createChannelBindToken,
  escapeHtml,
  extractChannelToken,
  formatLeaveNotification,
  getJakartaParts,
  isMorningReportWindow,
} from './telegram-notify.mjs';

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
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
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

function notFoundError() {
  const error = new Error('Data tidak ditemukan.');
  error.status = 404;
  return error;
}

async function patchRecord(table, id, changes) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    let existing = await client.query(
      `SELECT id, payload FROM ${table} WHERE id = $1 FOR UPDATE`,
      [id],
    );

    // Absensi unik per (perusahaan, karyawan, tanggal). HP sering punya id lokal
    // yang beda dari id di server — cari baris yang sama, jangan 404.
    if (existing.rowCount === 0 && table === 'app_sync_attendance_records') {
      const companyId = changes?.company_id;
      const employeeId = changes?.employee_id;
      const date = changes?.date;
      if (companyId && employeeId && date) {
        existing = await client.query(
          `SELECT id, payload FROM app_sync_attendance_records
           WHERE company_id = $1 AND employee_id = $2 AND attendance_date = $3::date
           FOR UPDATE`,
          [companyId, employeeId, date],
        );
      }
    }

    if (existing.rowCount === 0) {
      const employeeId = resolveRecordEmployeeId(table, { ...changes, id });
      if (!changes || !changes.company_id || !employeeId) {
        throw notFoundError();
      }

      const payload = { ...changes, id };
      if (table === 'app_sync_attendance_records') {
        if (!changes.date) throw notFoundError();
        const inserted = await client.query(
          `INSERT INTO app_sync_attendance_records (id, company_id, employee_id, attendance_date, payload)
           VALUES ($1, $2, $3, $4::date, $5::jsonb)
           ON CONFLICT (company_id, employee_id, attendance_date) DO NOTHING
           RETURNING payload`,
          [id, changes.company_id, changes.employee_id, changes.date, JSON.stringify(payload)],
        );
        if (inserted.rowCount > 0) {
          await client.query('COMMIT');
          return inserted.rows[0].payload;
        }
        existing = await client.query(
          `SELECT id, payload FROM app_sync_attendance_records
           WHERE company_id = $1 AND employee_id = $2 AND attendance_date = $3::date
           FOR UPDATE`,
          [changes.company_id, changes.employee_id, changes.date],
        );
        if (existing.rowCount === 0) throw notFoundError();
      } else {
        const inserted = await client.query(
          `INSERT INTO ${table} (id, company_id, employee_id, payload)
           VALUES ($1, $2, $3, $4::jsonb)
           ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()
           RETURNING payload`,
          [id, changes.company_id, employeeId, JSON.stringify(payload)],
        );
        await client.query('COMMIT');
        return inserted.rows[0].payload;
      }
    }

    const rowId = existing.rows[0].id;
    const payload = { ...existing.rows[0].payload, ...(changes || {}), id: rowId };
    const result = await client.query(
      `UPDATE ${table}
       SET payload = $2::jsonb, updated_at = NOW()
       WHERE id = $1
       RETURNING payload`,
      [rowId, JSON.stringify(payload)],
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
    if (
      request.path === '/health'
      || request.path === '/events'
      || request.path.startsWith('/auth/password-reset/')
      || request.path === '/telegram/webhook'
    ) {
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

// Telegram Bot Webhook — personal /start TOKEN, channel bind, membership
app.post('/api/telegram/webhook', async (request, response) => {
  try {
    const update = request.body || {};

    if (update.my_chat_member) {
      await handleBotMembershipChange(update.my_chat_member);
      return response.json({ ok: true });
    }

    if (update.channel_post) {
      await handleChannelBindPost(update.channel_post);
      return response.json({ ok: true });
    }

    const message = update.message;
    if (!message) return response.json({ ok: true });

    const chatType = String(message.chat?.type || '');
    if (chatType === 'group' || chatType === 'supergroup') {
      await handleChannelBindPost(message);
      return response.json({ ok: true });
    }

    const chatId = String(message.chat?.id || '');
    const text = String(message.text || '').trim();
    const firstName = message.from?.first_name || 'User';

    if (text.startsWith('/start ')) {
      const token = text.slice(7).trim();
      const channelToken = extractChannelToken(text);
      if (channelToken) {
        const bound = await bindChannelByToken(channelToken, {
          id: chatId,
          title: message.chat?.title || `${firstName} (chat pribadi)`,
        });
        if (bound.ok) {
          await sendTelegramMessageQuiet(
            chatId,
            `✅ Kode channel diterima, tapi notifikasi perusahaan harus masuk ke <b>channel</b>, bukan chat pribadi.\n\nBuat channel, tambahkan bot sebagai admin, lalu kirim kode yang sama di channel itu.`,
          );
          return response.json({ ok: true });
        }
      }

      const result = await pool.query(
        `UPDATE telegram_connections
         SET chat_id = $1, connected_at = NOW()
         WHERE connect_token = $2 AND chat_id IS NULL
         RETURNING employee_id`,
        [chatId, token],
      );

      if (result.rowCount > 0) {
        await sendTelegramMessageQuiet(chatId, `✅ <b>Telegram berhasil terhubung!</b>\n\nHalo ${escapeHtml(firstName)}, akun Anda sudah terhubung dengan sistem absensi.\nSekarang Anda bisa mereset password via Telegram.`);
      } else {
        await sendTelegramMessageQuiet(chatId, `⚠️ Token tidak valid atau sudah digunakan.`);
      }
    } else if (text === '/start') {
      await sendTelegramMessageQuiet(chatId, `👋 Halo ${escapeHtml(firstName)}!\n\nGunakan link dari aplikasi absensi untuk menghubungkan akun Anda.\n\nKetik /help untuk bantuan.`);
    } else if (text === '/help') {
      await sendTelegramMessageQuiet(chatId, `📖 <b>Bantuan</b>\n\nUntuk menghubungkan akun pribadi:\n1. Buka aplikasi absensi\n2. Klik "Connect Telegram"\n3. Klik link yang muncul\n4. Klik "Start" di sini\n\nUntuk channel perusahaan:\n1. Buat 1 channel per perusahaan\n2. Tambahkan bot ini sebagai admin\n3. Di aplikasi buka Pengaturan → Notifikasi\n4. Kirim kode ABSEN-XXXXXXXX di channel\n\nUntuk reset password:\n1. Klik "Lupa Password" di login\n2. Masukkan email Anda\n3. Kode akan dikirim ke Telegram ini`);
    }

    response.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    response.json({ ok: true });
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

async function sendTelegramMessageQuiet(chatId, text) {
  try {
    await sendTelegramMessage(chatId, text);
    return true;
  } catch (error) {
    console.error('Gagal mengirim pesan Telegram:', error.message);
    return false;
  }
}

function channelStatusPayload(row, botUsername = null) {
  return {
    ok: true,
    connected: Boolean(row?.chat_id),
    company_id: row?.company_id || null,
    company_name: row?.company_name || '',
    token: row?.connect_token || null,
    chat_id: row?.chat_id || null,
    chat_title: row?.chat_title || '',
    connected_at: row?.connected_at || null,
    bot_username: botUsername,
    bot_configured: Boolean(telegramBotToken),
  };
}

async function resolveBotUsernameSafe() {
  if (!telegramBotToken) return null;
  try {
    return await getBotUsername();
  } catch (error) {
    console.error('Gagal membaca username bot Telegram:', error.message);
    return null;
  }
}

async function bindChannelByToken(token, chat) {
  const chatId = String(chat?.id || '');
  if (!chatId || !token) return { ok: false, reason: 'invalid' };

  const result = await pool.query(
    `SELECT company_id, company_name, chat_id FROM telegram_channels WHERE UPPER(connect_token) = $1`,
    [token],
  );
  if (result.rowCount === 0) return { ok: false, reason: 'unknown_token' };

  const row = result.rows[0];
  const taken = await pool.query(
    `SELECT company_id, company_name FROM telegram_channels WHERE chat_id = $1 AND company_id <> $2`,
    [chatId, row.company_id],
  );
  if (taken.rowCount > 0) return { ok: false, reason: 'channel_taken', row };

  await pool.query(
    `UPDATE telegram_channels
     SET chat_id = $1, chat_title = $2, connected_at = NOW()
     WHERE company_id = $3`,
    [chatId, chat?.title || '', row.company_id],
  );

  return { ok: true, row: { ...row, chat_id: chatId, chat_title: chat?.title || '' } };
}

async function handleChannelBindPost(post) {
  const chatId = String(post?.chat?.id || '');
  const token = extractChannelToken(post?.text || post?.caption || '');
  if (!chatId || !token) return;

  const bound = await bindChannelByToken(token, {
    id: chatId,
    title: post.chat?.title || '',
  });

  if (!bound.ok && bound.reason === 'channel_taken') {
    await sendTelegramMessageQuiet(chatId, '⚠️ Channel ini sudah terhubung ke perusahaan lain.');
    return;
  }
  if (!bound.ok) return;

  const companyName = bound.row.company_name || bound.row.company_id;
  await sendTelegramMessageQuiet(
    chatId,
    `✅ <b>Channel terhubung</b>\n\nPerusahaan: <b>${escapeHtml(companyName)}</b>\n\nSetiap hari kerja jam <b>08.30 WIB</b> bot mengirim siapa yang tidak masuk beserta alasannya.\nJika semua masuk, tidak ada pesan pagi.\n\nPengajuan cuti/izin juga masuk ke sini.`,
  );
}

async function handleBotMembershipChange(update) {
  const chat = update?.chat || {};
  const chatId = String(chat.id || '');
  const membership = update?.new_chat_member || {};
  if (!chatId || !membership.user?.is_bot) return;

  const status = String(membership.status || '');
  if (status === 'left' || status === 'kicked') {
    await pool.query(
      `UPDATE telegram_channels
       SET chat_id = NULL, chat_title = NULL, connected_at = NULL
       WHERE chat_id = $1`,
      [chatId],
    );
    return;
  }

  const allowedTypes = new Set(['channel', 'group', 'supergroup']);
  if (!allowedTypes.has(chat.type) || (status !== 'administrator' && status !== 'member')) return;

  const existing = await pool.query(
    `SELECT company_id FROM telegram_channels WHERE chat_id = $1`,
    [chatId],
  );
  if (existing.rowCount > 0) return;

  const place = chat.type === 'channel' ? 'channel' : 'grup';
  await sendTelegramMessageQuiet(
    chatId,
    `👋 Bot absensi sudah masuk ke ${place} ini.\n\nUntuk menghubungkan dengan perusahaan:\n1. Buka <b>Pengaturan → Notifikasi</b> di aplikasi\n2. Klik <b>Hubungkan Channel</b>\n3. Kirim kode <code>ABSEN-XXXXXXXX</code> di sini`,
  );
}

async function notifyLeaveToChannel(request, event) {
  if (!telegramBotToken || !request?.company_id) return;
  const channel = await pool.query(
    `SELECT chat_id FROM telegram_channels WHERE company_id = $1 AND chat_id IS NOT NULL`,
    [request.company_id],
  );
  if (channel.rowCount === 0) return;
  await sendTelegramMessageQuiet(channel.rows[0].chat_id, formatLeaveNotification(request, event));
}

async function loadCompanyReportData(companyId, dateStr) {
  const [employees, attendances, leaves] = await Promise.all([
    pool.query(`SELECT payload FROM app_sync_employees WHERE company_id = $1`, [companyId]),
    pool.query(
      `SELECT payload FROM app_sync_attendance_records WHERE company_id = $1 AND attendance_date = $2::date`,
      [companyId, dateStr],
    ),
    pool.query(`SELECT payload FROM app_sync_leave_requests WHERE company_id = $1`, [companyId]),
  ]);
  return {
    employees: employees.rows.map((row) => row.payload),
    attendances: attendances.rows.map((row) => row.payload),
    leaveRequests: leaves.rows.map((row) => row.payload),
  };
}

async function buildCompanyMorningReport(channel, dateStr) {
  const data = await loadCompanyReportData(channel.company_id, dateStr);
  return buildMorningReport({
    companyName: channel.company_name,
    dateStr,
    ...data,
  });
}

async function sendMorningReportForCompany(channel, dateStr) {
  const report = await buildCompanyMorningReport(channel, dateStr);
  if (report.allPresent) return { ...report, sent: false, reason: 'all_present' };
  if (!channel.chat_id) return { ...report, sent: false, reason: 'channel_not_connected' };
  if (!telegramBotToken) return { ...report, sent: false, reason: 'bot_not_configured' };

  const sent = await sendTelegramMessageQuiet(channel.chat_id, report.message);
  return { ...report, sent, reason: sent ? null : 'send_failed' };
}

const MORNING_REPORT_META_KEY = 'telegram_morning_report';

async function loadMorningReportState() {
  const result = await pool.query('SELECT value FROM app_sync_metadata WHERE key = $1', [MORNING_REPORT_META_KEY]);
  if (result.rowCount === 0) return {};
  try {
    return JSON.parse(result.rows[0].value) || {};
  } catch {
    return {};
  }
}

async function markMorningReportSent(companyId, dateStr) {
  const state = await loadMorningReportState();
  state[companyId] = dateStr;
  await pool.query(
    `INSERT INTO app_sync_metadata (key, value)
     VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
    [MORNING_REPORT_META_KEY, JSON.stringify(state)],
  );
}

async function runScheduledMorningReports() {
  const parts = getJakartaParts();
  if (!isMorningReportWindow(parts)) return;

  const channels = await pool.query(
    `SELECT company_id, company_name, chat_id FROM telegram_channels WHERE chat_id IS NOT NULL`,
  );
  if (channels.rowCount === 0) return;

  const sentState = await loadMorningReportState();
  for (const channel of channels.rows) {
    if (sentState[channel.company_id] === parts.dateStr) continue;
    try {
      const result = await sendMorningReportForCompany(channel, parts.dateStr);
      await markMorningReportSent(channel.company_id, parts.dateStr);
      if (result.allPresent) {
        console.log(`Laporan pagi ${channel.company_id} ${parts.dateStr}: semua masuk, tidak dikirim.`);
      } else if (result.sent) {
        console.log(`Laporan pagi ${channel.company_id} ${parts.dateStr}: ${result.absences.length} tidak masuk, terkirim.`);
      } else {
        console.error(`Laporan pagi ${channel.company_id} ${parts.dateStr} gagal: ${result.reason}`);
      }
    } catch (error) {
      console.error(`Gagal laporan pagi ${channel.company_id}:`, error.message);
    }
  }
}

let morningReportTimer;
function startMorningReportScheduler() {
  if (memoryDatabase) return;
  morningReportTimer = setInterval(() => {
    runScheduledMorningReports().catch((error) => {
      console.error('Scheduler laporan pagi:', error.message);
    });
  }, 30_000);
  runScheduledMorningReports().catch(() => {});
}

app.post('/api/telegram/channel/connect', async (request, response, next) => {
  try {
    const companyId = String(request.body?.company_id || '').trim();
    const companyName = String(request.body?.company_name || '').trim();
    if (!companyId) {
      return response.status(400).json({ error: 'company_id wajib diisi.' });
    }

    const connectToken = createChannelBindToken();
    const existing = await pool.query(
      `SELECT company_name FROM telegram_channels WHERE company_id = $1`,
      [companyId],
    );
    const storedName = companyName || existing.rows[0]?.company_name || '';
    const result = await pool.query(
      `INSERT INTO telegram_channels (company_id, company_name, connect_token)
       VALUES ($1, $2, $3)
       ON CONFLICT (company_id) DO UPDATE SET
         company_name = EXCLUDED.company_name,
         connect_token = EXCLUDED.connect_token
       RETURNING company_id, company_name, connect_token, chat_id, chat_title, connected_at`,
      [companyId, storedName, connectToken],
    );

    const botUsername = await resolveBotUsernameSafe();
    response.json(channelStatusPayload(result.rows[0], botUsername));
  } catch (error) {
    next(error);
  }
});

app.get('/api/telegram/channel/status', async (request, response, next) => {
  try {
    const companyId = String(request.query?.company_id || '').trim();
    if (!companyId) {
      return response.status(400).json({ error: 'company_id wajib diisi.' });
    }

    const result = await pool.query(
      `SELECT company_id, company_name, connect_token, chat_id, chat_title, connected_at
       FROM telegram_channels WHERE company_id = $1`,
      [companyId],
    );
    const botUsername = await resolveBotUsernameSafe();
    response.json(channelStatusPayload(result.rows[0] || { company_id: companyId }, botUsername));
  } catch (error) {
    next(error);
  }
});

app.delete('/api/telegram/channel', async (request, response, next) => {
  try {
    const companyId = String(request.query?.company_id || request.body?.company_id || '').trim();
    if (!companyId) {
      return response.status(400).json({ error: 'company_id wajib diisi.' });
    }

    await pool.query(
      `UPDATE telegram_channels
       SET chat_id = NULL, chat_title = NULL, connected_at = NULL, connect_token = $2
       WHERE company_id = $1`,
      [companyId, createChannelBindToken()],
    );

    const result = await pool.query(
      `SELECT company_id, company_name, connect_token, chat_id, chat_title, connected_at
       FROM telegram_channels WHERE company_id = $1`,
      [companyId],
    );
    const botUsername = await resolveBotUsernameSafe();
    response.json(channelStatusPayload(result.rows[0] || { company_id: companyId }, botUsername));
  } catch (error) {
    next(error);
  }
});

app.post('/api/telegram/channel/test', async (request, response, next) => {
  try {
    const companyId = String(request.body?.company_id || '').trim();
    if (!companyId) {
      return response.status(400).json({ error: 'company_id wajib diisi.' });
    }

    const result = await pool.query(
      `SELECT company_id, company_name, chat_id, chat_title
       FROM telegram_channels WHERE company_id = $1`,
      [companyId],
    );
    if (result.rowCount === 0 || !result.rows[0].chat_id) {
      return response.status(400).json({ error: 'Channel belum terhubung.' });
    }
    if (!telegramBotToken) {
      return response.status(500).json({ error: 'Layanan Telegram belum dikonfigurasi di server.' });
    }

    const channel = result.rows[0];
    await sendTelegramMessage(
      channel.chat_id,
      `🔔 <b>Tes notifikasi</b>\n\nChannel <b>${escapeHtml(channel.company_name || companyId)}</b> sudah siap.\n\nLaporan ketidakhadiran otomatis setiap hari kerja jam 08.30 WIB.\nJika semua masuk, tidak ada pesan pagi.`,
    );
    response.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.post('/api/telegram/channel/report', async (request, response, next) => {
  try {
    const companyId = String(request.body?.company_id || '').trim();
    const dateStr = String(request.body?.date || getJakartaParts().dateStr).trim();
    if (!companyId) {
      return response.status(400).json({ error: 'company_id wajib diisi.' });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return response.status(400).json({ error: 'Format tanggal harus YYYY-MM-DD.' });
    }

    const result = await pool.query(
      `SELECT company_id, company_name, chat_id FROM telegram_channels WHERE company_id = $1`,
      [companyId],
    );
    const channel = result.rows[0] || { company_id: companyId, company_name: '', chat_id: null };
    if (!channel.company_name && request.body?.company_name) {
      channel.company_name = String(request.body.company_name);
    }

    const report = await sendMorningReportForCompany(channel, dateStr);
    response.json({ ok: true, ...report });
  } catch (error) {
    next(error);
  }
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
      if (name === 'leaveRequests') {
        notifyLeaveToChannel(saved, saved.status === 'PENDING' ? 'SUBMITTED' : saved.status).catch((error) => {
          console.error('Gagal notifikasi pengajuan cuti/izin:', error.message);
        });
      }
      response.status(201).json(saved);
    } catch (error) {
      next(error);
    }
  });

  app.patch(`/api/${config.apiPath}/:id`, async (request, response, next) => {
    try {
      const saved = await patchRecord(config.table, request.params.id, request.body);
      await publishChange(name, request.params.id);
      if (name === 'leaveRequests' && (saved.status === 'APPROVED' || saved.status === 'REJECTED')) {
        notifyLeaveToChannel(saved, saved.status).catch((error) => {
          console.error('Gagal notifikasi status cuti/izin:', error.message);
        });
      }
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

app.use((error, request, response, _next) => {
  const status = error.status || 500;
  if (status >= 500) {
    console.error(error);
  } else {
    console.warn(`${request.method} ${request.originalUrl || request.url} → ${status} ${error.message}`);
  }
  response.status(status).json({
    error: status >= 400 && status < 500 && error.message
      ? error.message
      : 'Terjadi kesalahan pada server.',
  });
});

await initializeDatabase();
await connectChangeListener();
startMorningReportScheduler();

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Absensi API berjalan pada port ${port}.`);
});

const heartbeat = setInterval(() => {
  for (const response of eventClients) response.write(': keep-alive\n\n');
}, 25_000);

async function shutdown() {
  clearInterval(heartbeat);
  clearInterval(morningReportTimer);
  clearTimeout(listenerRetryTimer);
  server.close();
  if (listenerClient) await listenerClient.end().catch(() => {});
  await pool.end();
  process.exit(0);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
