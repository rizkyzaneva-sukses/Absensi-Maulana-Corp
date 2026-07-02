import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const port = 3199;
const baseUrl = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ['server/index.mjs'], {
  cwd: process.cwd(),
  env: { ...process.env, DATABASE_URL: 'memory://', PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe'],
});

let serverOutput = '';
server.stdout.on('data', (chunk) => { serverOutput += chunk; });
server.stderr.on('data', (chunk) => { serverOutput += chunk; });

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return response.json();
    } catch {
      // Server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Server test tidak siap.\n${serverOutput}`);
}

async function jsonRequest(path, init) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  const body = await response.json();
  assert.equal(response.ok, true, JSON.stringify(body));
  return body;
}

async function readEvent(reader, eventName) {
  const decoder = new TextDecoder();
  let content = '';
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Event ${eventName} tidak diterima.`)), 2_000),
  );
  const reading = (async () => {
    while (!content.includes(`event: ${eventName}`)) {
      const { done, value } = await reader.read();
      if (done) throw new Error('Kanal realtime ditutup terlalu awal.');
      content += decoder.decode(value, { stream: true });
    }
    return content;
  })();
  return Promise.race([reading, timeout]);
}

const attendance = {
  id: 'ATT-TEST-1',
  company_id: 'COMPANY-1',
  employee_id: 'EMPLOYEE-1',
  date: '2026-07-02',
  check_in_time: '2026-07-02T01:00:00.000Z',
  check_out_time: null,
  status: 'HADIR',
  check_in_method: 'SELFIE',
  check_in_location: null,
  check_out_location: null,
  check_in_photo_url: '',
  notes: '',
  is_auto_checkout: false,
  overtime_minutes: 0,
  late_minutes: 0,
  early_leave_minutes: 0,
};

try {
  const health = await waitForServer();
  assert.equal(health.ok, true);
  assert.ok(health.instanceId);

  const controller = new AbortController();
  const events = await fetch(`${baseUrl}/api/events`, { signal: controller.signal });
  assert.equal(events.headers.get('content-type')?.startsWith('text/event-stream'), true);
  const eventReader = events.body.getReader();
  await readEvent(eventReader, 'ready');

  await jsonRequest('/api/sync/import', {
    method: 'POST',
    body: JSON.stringify({
      attendances: [attendance],
      leaveRequests: [],
      overtimeRequests: [],
      corrections: [],
    }),
  });
  await readEvent(eventReader, 'sync');

  let synced = await jsonRequest('/api/sync');
  assert.equal(synced.attendances.length, 1);
  assert.equal(synced.attendances[0].id, attendance.id);

  const updated = await jsonRequest(`/api/attendances/${attendance.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ check_out_time: '2026-07-02T10:00:00.000Z' }),
  });
  assert.equal(updated.check_out_time, '2026-07-02T10:00:00.000Z');

  const duplicate = await jsonRequest('/api/attendances', {
    method: 'POST',
    body: JSON.stringify({ ...attendance, id: 'ATT-DUPLICATE' }),
  });
  assert.equal(duplicate.id, attendance.id);
  assert.equal(duplicate.check_out_time, '2026-07-02T10:00:00.000Z');

  synced = await jsonRequest('/api/sync');
  assert.equal(synced.attendances.length, 1);
  assert.equal(synced.attendances[0].check_out_time, '2026-07-02T10:00:00.000Z');

  controller.abort();

  console.log('Integration test PostgreSQL sync: OK');
} finally {
  server.kill('SIGTERM');
}
