/**
 * Inject HADIR check-in at 07:50 WIB for all active employees on a given date.
 * Usage: node scripts/inject-today-hadir.mjs [YYYY-MM-DD]
 * Env: BASE_URL, API_KEY (or reads from temp key file)
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const baseUrl = process.env.BASE_URL || 'https://absensi.maulanacorp.my.id';
const dateArg = process.argv[2] || new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });

function loadApiKey() {
  if (process.env.API_KEY) return process.env.API_KEY;
  const candidates = [
    path.join(os.tmpdir(), 'kilo', 'api_key.txt'),
    'C:\\Users\\RIZKYZ~1\\AppData\\Local\\Temp\\kilo\\api_key.txt',
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8').trim();
    } catch {
      // continue
    }
  }
  throw new Error('API_KEY tidak ditemukan');
}

const apiKey = loadApiKey();

async function api(pathname, init = {}) {
  const res = await fetch(`${baseUrl}${pathname}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    throw new Error(`${init.method || 'GET'} ${pathname} -> ${res.status} ${JSON.stringify(body)}`);
  }
  return body;
}

// 07:50 WIB = 00:50 UTC
const checkInIso = `${dateArg}T00:50:00.000Z`;
const officeLocation = { lat: -6.887259844765239, lng: 107.54658055311016 };

const sync = await api('/api/sync');
const employees = (sync.employees || []).filter((e) => e.is_active !== false);
const attendances = sync.attendances || [];

console.log(`Base: ${baseUrl}`);
console.log(`Date: ${dateArg} | check_in: ${checkInIso} (07:50 WIB)`);
console.log(`Employees aktif: ${employees.length}`);
console.log(`Attendance total: ${attendances.length}`);

const todayByEmp = new Map(
  attendances
    .filter((a) => a.date === dateArg)
    .map((a) => [a.employee_id, a]),
);

let created = 0;
let updated = 0;
let skipped = 0;
const results = [];

for (const emp of employees) {
  const existing = todayByEmp.get(emp.id);
  const companyId = emp.company_id || 'comp_elyasr';

  if (existing?.check_in_time && existing.status !== 'TIDAK_HADIR') {
    // Force update to 07:50 HADIR as requested ("semua masuk jam 7.50")
    const patch = {
      check_in_time: checkInIso,
      status: 'HADIR',
      check_in_method: existing.check_in_method || 'QR',
      check_in_location: existing.check_in_location || officeLocation,
      late_minutes: 0,
      notes: existing.notes || 'Inject: hadir 07:50 WIB',
    };
    await api(`/api/attendances/${existing.id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
    updated += 1;
    results.push({ name: emp.full_name, action: 'patched', id: existing.id });
    continue;
  }

  if (existing && (!existing.check_in_time || existing.status === 'TIDAK_HADIR')) {
    const patch = {
      check_in_time: checkInIso,
      check_out_time: null,
      status: 'HADIR',
      check_in_method: 'QR',
      check_in_location: officeLocation,
      check_in_photo_url: '',
      notes: 'Inject: hadir 07:50 WIB',
      is_auto_checkout: false,
      overtime_minutes: 0,
      late_minutes: 0,
      early_leave_minutes: 0,
    };
    await api(`/api/attendances/${existing.id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
    updated += 1;
    results.push({ name: emp.full_name, action: 'upgraded-absent', id: existing.id });
    continue;
  }

  const record = {
    id: `ATT_INJECT_${dateArg.replace(/-/g, '')}_${emp.id.slice(-8)}`,
    company_id: companyId,
    employee_id: emp.id,
    date: dateArg,
    check_in_time: checkInIso,
    check_out_time: null,
    status: 'HADIR',
    check_in_method: 'QR',
    check_in_location: officeLocation,
    check_out_location: null,
    check_in_photo_url: '',
    notes: 'Inject: hadir 07:50 WIB',
    is_auto_checkout: false,
    overtime_minutes: 0,
    late_minutes: 0,
    early_leave_minutes: 0,
  };

  // Prefer POST; if existing TIDAK_HADIR was returned without upgrade (old server), PATCH by id from response
  const saved = await api('/api/attendances', {
    method: 'POST',
    body: JSON.stringify(record),
  });

  if (saved?.check_in_time === checkInIso || saved?.status === 'HADIR') {
    created += 1;
    results.push({ name: emp.full_name, action: 'created', id: saved.id });
  } else if (saved?.id && (!saved.check_in_time || saved.status === 'TIDAK_HADIR')) {
    await api(`/api/attendances/${saved.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        check_in_time: checkInIso,
        status: 'HADIR',
        check_in_method: 'QR',
        check_in_location: officeLocation,
        notes: 'Inject: hadir 07:50 WIB',
        late_minutes: 0,
      }),
    });
    updated += 1;
    results.push({ name: emp.full_name, action: 'post-then-patch', id: saved.id });
  } else {
    skipped += 1;
    results.push({ name: emp.full_name, action: 'unexpected', saved });
  }
}

// Verify
const after = await api('/api/sync');
const todayAfter = (after.attendances || []).filter((a) => a.date === dateArg);
const hadir = todayAfter.filter((a) => a.status === 'HADIR' && a.check_in_time);
console.log('\n=== RESULT ===');
console.log({ created, updated, skipped, todayTotal: todayAfter.length, hadirCount: hadir.length });
for (const r of results) {
  console.log(`- ${r.name}: ${r.action} (${r.id || '-'})`);
}
console.log('\nToday HADIR:');
for (const a of hadir) {
  const emp = employees.find((e) => e.id === a.employee_id);
  console.log(`- ${emp?.full_name || a.employee_id}: ${a.check_in_time} ${a.status}`);
}
