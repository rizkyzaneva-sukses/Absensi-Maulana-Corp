import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import {
  buildMorningReport,
  extractChannelToken,
  formatLeaveNotification,
  isMorningReportWindow,
} from './telegram-notify.mjs';

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

  const remapped = await jsonRequest('/api/attendances/ATT-LOCAL-PHONE', {
    method: 'PATCH',
    body: JSON.stringify({
      ...attendance,
      id: 'ATT-LOCAL-PHONE',
      check_out_time: '2026-07-02T11:00:00.000Z',
      notes: 'checkout dari HP lain',
    }),
  });
  assert.equal(remapped.id, attendance.id);
  assert.equal(remapped.check_out_time, '2026-07-02T11:00:00.000Z');
  assert.equal(remapped.notes, 'checkout dari HP lain');

  const missingPatch = await fetch(`${baseUrl}/api/attendances/ATT-DOES-NOT-EXIST`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ check_out_time: '2026-07-02T12:00:00.000Z' }),
  });
  assert.equal(missingPatch.status, 404);

  const createdByPatch = await jsonRequest('/api/leave-requests/LEAVE-FROM-PATCH', {
    method: 'PATCH',
    body: JSON.stringify({
      id: 'LEAVE-FROM-PATCH',
      company_id: 'COMPANY-1',
      employee_id: 'EMPLOYEE-1',
      employee_name: 'Tes',
      type: 'IZIN',
      start_date: '2026-07-03',
      end_date: '2026-07-03',
      reason: 'Urusan keluarga',
      status: 'PENDING',
      approved_by: null,
      created_at: '2026-07-02T00:00:00.000Z',
    }),
  });
  assert.equal(createdByPatch.id, 'LEAVE-FROM-PATCH');
  assert.equal(createdByPatch.status, 'PENDING');

  const duplicate = await jsonRequest('/api/attendances', {
    method: 'POST',
    body: JSON.stringify({ ...attendance, id: 'ATT-DUPLICATE' }),
  });
  assert.equal(duplicate.id, attendance.id);
  assert.equal(duplicate.check_out_time, '2026-07-02T11:00:00.000Z');

  synced = await jsonRequest('/api/sync');
  assert.equal(synced.attendances.length, 1);
  assert.equal(synced.attendances[0].id, attendance.id);
  assert.equal(synced.attendances[0].check_out_time, '2026-07-02T11:00:00.000Z');

  controller.abort();

  assert.equal(extractChannelToken('ABSEN-A1B2C3D4'), 'ABSEN-A1B2C3D4');
  assert.equal(extractChannelToken('/ikat absen-aabbccdd'), 'ABSEN-AABBCCDD');
  assert.equal(extractChannelToken('halo bot'), null);
  assert.equal(isMorningReportWindow({ weekday: 5, hour: 8, minute: 30 }), true);
  assert.equal(isMorningReportWindow({ weekday: 0, hour: 8, minute: 30 }), false);
  assert.equal(isMorningReportWindow({ weekday: 5, hour: 9, minute: 0 }), false);

  const preview = buildMorningReport({
    companyName: 'PT Tes',
    dateStr: '2026-08-14',
    employees: [
      { id: 'EMP-OWNER', full_name: 'Owner', role: 'SUPER_ADMIN', is_active: true },
      { id: 'EMP-A', full_name: 'Andi Hadir', role: 'KARYAWAN', is_active: true },
      { id: 'EMP-B', full_name: 'Budi Cuti', role: 'KARYAWAN', is_active: true },
      { id: 'EMP-C', full_name: 'Citra Absen', role: 'KARYAWAN', is_active: true },
    ],
    attendances: [
      { employee_id: 'EMP-A', check_in_time: '2026-08-14T01:00:00.000Z', status: 'HADIR' },
    ],
    leaveRequests: [
      {
        employee_id: 'EMP-B',
        type: 'CUTI',
        status: 'APPROVED',
        start_date: '2026-08-14',
        end_date: '2026-08-15',
        reason: 'Liburan keluarga',
      },
    ],
  });
  assert.equal(preview.allPresent, false);
  assert.deepEqual(preview.absences.map((item) => item.name), ['Budi Cuti', 'Citra Absen']);
  assert.match(preview.message, /Budi Cuti/);
  assert.match(preview.message, /Liburan keluarga/);

  const leaveText = formatLeaveNotification({
    employee_name: 'Siti Izin',
    type: 'IZIN',
    start_date: '2026-08-14',
    end_date: '2026-08-14',
    reason: 'Urusan keluarga',
    status: 'PENDING',
  }, 'SUBMITTED');
  assert.match(leaveText, /Pengajuan Izin baru/);
  assert.match(leaveText, /Siti Izin/);

  const connect = await jsonRequest('/api/telegram/channel/connect', {
    method: 'POST',
    body: JSON.stringify({ company_id: 'COMPANY-1', company_name: 'PT Tes' }),
  });
  assert.match(connect.token, /^ABSEN-[A-F0-9]{8}$/);
  assert.equal(connect.connected, false);

  const statusBefore = await jsonRequest('/api/telegram/channel/status?company_id=COMPANY-1');
  assert.equal(statusBefore.connected, false);
  assert.equal(statusBefore.token, connect.token);

  await jsonRequest('/api/employees', {
    method: 'POST',
    body: JSON.stringify({
      id: 'EMP-OWNER',
      company_id: 'COMPANY-1',
      employee_id: 'OWN-1',
      full_name: 'Owner',
      role: 'SUPER_ADMIN',
      is_active: true,
      user_email: 'owner@test.com',
    }),
  });
  await jsonRequest('/api/employees', {
    method: 'POST',
    body: JSON.stringify({
      id: 'EMP-A',
      company_id: 'COMPANY-1',
      employee_id: 'A-1',
      full_name: 'Andi Hadir',
      role: 'KARYAWAN',
      is_active: true,
      user_email: 'andi@test.com',
    }),
  });
  await jsonRequest('/api/employees', {
    method: 'POST',
    body: JSON.stringify({
      id: 'EMP-B',
      company_id: 'COMPANY-1',
      employee_id: 'B-1',
      full_name: 'Budi Cuti',
      role: 'KARYAWAN',
      is_active: true,
      user_email: 'budi@test.com',
    }),
  });
  await jsonRequest('/api/employees', {
    method: 'POST',
    body: JSON.stringify({
      id: 'EMP-C',
      company_id: 'COMPANY-1',
      employee_id: 'C-1',
      full_name: 'Citra Absen',
      role: 'KARYAWAN',
      is_active: true,
      user_email: 'citra@test.com',
    }),
  });

  await jsonRequest('/api/attendances', {
    method: 'POST',
    body: JSON.stringify({
      ...attendance,
      id: 'ATT-ANDI',
      employee_id: 'EMP-A',
      date: '2026-08-14',
      check_in_time: '2026-08-14T01:00:00.000Z',
      status: 'HADIR',
    }),
  });
  await jsonRequest('/api/leave-requests', {
    method: 'POST',
    body: JSON.stringify({
      id: 'LEAVE-BUDI',
      company_id: 'COMPANY-1',
      employee_id: 'EMP-B',
      employee_name: 'Budi Cuti',
      type: 'CUTI',
      start_date: '2026-08-14',
      end_date: '2026-08-15',
      reason: 'Liburan keluarga',
      status: 'APPROVED',
      approved_by: 'manager',
      created_at: '2026-08-13T00:00:00.000Z',
    }),
  });

  const report = await jsonRequest('/api/telegram/channel/report', {
    method: 'POST',
    body: JSON.stringify({ company_id: 'COMPANY-1', company_name: 'PT Tes', date: '2026-08-14' }),
  });
  assert.equal(report.allPresent, false);
  assert.equal(report.sent, false);
  assert.ok(report.absences.some((item) => item.name === 'Budi Cuti' && item.label === 'Cuti'));
  assert.ok(report.absences.some((item) => item.name === 'Citra Absen' && item.label === 'Belum absen'));
  assert.ok(!report.absences.some((item) => item.name === 'Andi Hadir'));
  assert.ok(!report.absences.some((item) => item.name === 'Owner'));

  await jsonRequest('/api/attendances', {
    method: 'POST',
    body: JSON.stringify({
      ...attendance,
      id: 'ATT-ANDI-13',
      employee_id: 'EMP-A',
      date: '2026-08-13',
      check_in_time: '2026-08-13T01:00:00.000Z',
      status: 'HADIR',
    }),
  });
  await jsonRequest('/api/attendances', {
    method: 'POST',
    body: JSON.stringify({
      ...attendance,
      id: 'ATT-BUDI-13',
      employee_id: 'EMP-B',
      date: '2026-08-13',
      check_in_time: '2026-08-13T01:00:00.000Z',
      status: 'HADIR',
    }),
  });
  await jsonRequest('/api/attendances', {
    method: 'POST',
    body: JSON.stringify({
      ...attendance,
      id: 'ATT-CITRA-13',
      employee_id: 'EMP-C',
      date: '2026-08-13',
      check_in_time: '2026-08-13T01:00:00.000Z',
      status: 'HADIR',
    }),
  });

  const allPresent = await jsonRequest('/api/telegram/channel/report', {
    method: 'POST',
    body: JSON.stringify({ company_id: 'COMPANY-1', date: '2026-08-13' }),
  });
  assert.equal(allPresent.allPresent, true);
  assert.equal(allPresent.sent, false);
  assert.equal(allPresent.absences.length, 0);

  const connectForBind = await jsonRequest('/api/telegram/channel/connect', {
    method: 'POST',
    body: JSON.stringify({ company_id: 'COMPANY-1', company_name: 'PT Tes' }),
  });
  const bind = await fetch(`${baseUrl}/api/telegram/webhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      channel_post: {
        chat: { id: -100123456, title: 'Absensi PT Tes', type: 'channel' },
        text: connectForBind.token,
      },
    }),
  });
  assert.equal(bind.ok, true);
  const statusAfter = await jsonRequest('/api/telegram/channel/status?company_id=COMPANY-1');
  assert.equal(statusAfter.connected, true);
  assert.equal(statusAfter.chat_id, '-100123456');
  assert.equal(statusAfter.chat_title, 'Absensi PT Tes');

  console.log('Integration test PostgreSQL sync: OK');
} finally {
  server.kill('SIGTERM');
}
