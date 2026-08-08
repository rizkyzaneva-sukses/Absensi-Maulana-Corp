/**
 * Koreksi absensi massal untuk semua karyawan aktif, tanggal-tanggal berikut:
 *   1 Agustus 2026        : masuk 07:50 WIB, pulang 15:00 WIB
 *   3-7 Agustus 2026      : masuk 07:50 WIB, pulang 17:10 WIB
 *   8 Agustus 2026 (hari ini) : masuk 07:50 WIB (jam pulang tidak diubah)
 *
 * Karyawan yang tercatat CUTI/IZIN/SAKIT/IZIN_SEPARUH di tanggal tsb (baik dari
 * record absensi yang sudah ada maupun dari leave request yang APPROVED) DILEWATI,
 * tidak diubah jadi Hadir.
 *
 * Aman dijalankan berkali-kali (idempotent) — akan menimpa (overwrite) data yang
 * sudah ada di tanggal-tanggal tsb selain yang dilewati di atas.
 *
 * CARA JALANKAN (harus di environment dengan DATABASE_URL production yang asli,
 * misal terminal EasyPanel untuk service app ini — .env lokal cuma placeholder):
 *
 *   node scripts/bulk-correct-attendance.mjs
 *     -> dry-run, cuma preview, TIDAK menulis apa pun
 *
 *   node scripts/bulk-correct-attendance.mjs --apply
 *     -> benar-benar menulis ke database
 *
 *   node scripts/bulk-correct-attendance.mjs --apply --company=<company_id>
 *     -> kalau ada lebih dari satu company di database, wajib pilih salah satu
 *
 *   node scripts/bulk-correct-attendance.mjs --apply --include-inactive
 *     -> ikut proses karyawan yang is_active=false (default: dilewati)
 */
import 'dotenv/config';
import pg from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL || DATABASE_URL.includes('POSTGRES_SERVICE')) {
  console.error(
    'DATABASE_URL belum di-set ke database production yang asli.\n' +
    'Jalankan script ini di environment server (mis. terminal EasyPanel untuk service app),\n' +
    'bukan dari .env lokal yang isinya placeholder.'
  );
  process.exit(1);
}

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const INCLUDE_INACTIVE = args.includes('--include-inactive');
const companyArg = args.find((a) => a.startsWith('--company='));
const targetCompanyId = companyArg ? companyArg.split('=')[1] : null;

// WIB (Asia/Jakarta) = UTC+7 sepanjang tahun, tidak ada DST.
function wibToUtcIso(dateStr, hh, mm) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, hh - 7, mm, 0)).toISOString();
}

const CORRECTIONS = [
  { date: '2026-08-01', checkIn: [7, 50], checkOut: [15, 0] },
  { date: '2026-08-03', checkIn: [7, 50], checkOut: [17, 10] },
  { date: '2026-08-04', checkIn: [7, 50], checkOut: [17, 10] },
  { date: '2026-08-05', checkIn: [7, 50], checkOut: [17, 10] },
  { date: '2026-08-06', checkIn: [7, 50], checkOut: [17, 10] },
  { date: '2026-08-07', checkIn: [7, 50], checkOut: [17, 10] },
  { date: '2026-08-08', checkIn: [7, 50], checkOut: null }, // hari ini: jam pulang tidak disentuh
];

const SKIP_STATUSES = new Set(['CUTI', 'IZIN', 'SAKIT', 'IZIN_SEPARUH']);

function generateId(prefix = 'att') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

async function main() {
  const pool = new pg.Pool({ connectionString: DATABASE_URL });

  const companiesRes = await pool.query('SELECT DISTINCT company_id FROM app_sync_employees');
  const companyIds = companiesRes.rows.map((r) => r.company_id);

  let companyId = targetCompanyId;
  if (!companyId) {
    if (companyIds.length === 0) {
      console.error('Tidak ada data karyawan sama sekali di database.');
      await pool.end();
      process.exit(1);
    }
    if (companyIds.length > 1) {
      console.error('Ada lebih dari satu company di database. Pilih salah satu dengan --company=<id>:');
      companyIds.forEach((id) => console.error(`  - ${id}`));
      await pool.end();
      process.exit(1);
    }
    companyId = companyIds[0];
  }

  const employeesRes = await pool.query(
    'SELECT id, payload FROM app_sync_employees WHERE company_id = $1',
    [companyId]
  );
  let employees = employeesRes.rows.map((r) => r.payload);
  if (!INCLUDE_INACTIVE) {
    employees = employees.filter((e) => e.is_active !== false);
  }
  console.log(`Company: ${companyId}`);
  console.log(`Karyawan yang diproses: ${employees.length}${INCLUDE_INACTIVE ? '' : ' (aktif saja)'}`);

  const dates = CORRECTIONS.map((c) => c.date);

  const attRes = await pool.query(
    `SELECT id, employee_id, attendance_date::text AS date, payload
     FROM app_sync_attendance_records
     WHERE company_id = $1 AND attendance_date = ANY($2::date[])`,
    [companyId, dates]
  );
  const existingByKey = new Map();
  for (const row of attRes.rows) {
    existingByKey.set(`${row.employee_id}|${row.date}`, row);
  }

  const leaveRes = await pool.query(
    'SELECT payload FROM app_sync_leave_requests WHERE company_id = $1',
    [companyId]
  );
  const approvedLeaves = leaveRes.rows
    .map((r) => r.payload)
    .filter((lr) => lr.status === 'APPROVED');

  function isOnApprovedLeave(employeeId, date) {
    return approvedLeaves.some(
      (lr) => lr.employee_id === employeeId && lr.start_date <= date && date <= lr.end_date
    );
  }

  const toUpsert = [];
  const skipped = [];

  for (const emp of employees) {
    for (const corr of CORRECTIONS) {
      const key = `${emp.id}|${corr.date}`;
      const existing = existingByKey.get(key);

      if (existing && SKIP_STATUSES.has(existing.payload.status)) {
        skipped.push({ employee: emp.full_name, date: corr.date, reason: `status existing: ${existing.payload.status}` });
        continue;
      }
      if (isOnApprovedLeave(emp.id, corr.date)) {
        skipped.push({ employee: emp.full_name, date: corr.date, reason: 'cuti/izin/sakit disetujui' });
        continue;
      }

      const checkInIso = wibToUtcIso(corr.date, corr.checkIn[0], corr.checkIn[1]);
      const checkOutIso = corr.checkOut
        ? wibToUtcIso(corr.date, corr.checkOut[0], corr.checkOut[1])
        : (existing?.payload.check_out_time ?? null);

      toUpsert.push({
        id: existing?.id || generateId('att'),
        company_id: companyId,
        employee_id: emp.id,
        date: corr.date,
        check_in_time: checkInIso,
        check_out_time: checkOutIso,
        status: 'HADIR',
        check_in_method: 'MANUAL',
        check_in_location: existing?.payload.check_in_location ?? null,
        check_out_location: existing?.payload.check_out_location ?? null,
        check_in_photo_url: existing?.payload.check_in_photo_url ?? '',
        notes: 'Koreksi absensi massal oleh admin',
        is_auto_checkout: false,
        overtime_minutes: 0,
        late_minutes: 0,
        early_leave_minutes: 0,
      });
    }
  }

  console.log(`\n${APPLY ? 'Menulis' : '[DRY-RUN] Akan menulis'} ${toUpsert.length} baris absensi.`);
  console.log(`Dilewati (cuti/izin/sakit): ${skipped.length}`);
  if (skipped.length) {
    console.table(skipped.slice(0, 30));
    if (skipped.length > 30) console.log(`... dan ${skipped.length - 30} lainnya`);
  }

  if (!APPLY) {
    console.log('\nContoh baris yang akan ditulis:');
    console.table(
      toUpsert.slice(0, 5).map((r) => ({
        employee_id: r.employee_id,
        date: r.date,
        check_in_wib: new Date(r.check_in_time).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
        check_out_wib: r.check_out_time
          ? new Date(r.check_out_time).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
          : '(tidak diubah)',
      }))
    );
    console.log('\nMode DRY-RUN — tidak ada perubahan ditulis. Jalankan ulang dengan --apply untuk benar-benar menulis.');
    await pool.end();
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const record of toUpsert) {
      await client.query(
        `INSERT INTO app_sync_attendance_records (id, company_id, employee_id, attendance_date, payload)
         VALUES ($1, $2, $3, $4::date, $5::jsonb)
         ON CONFLICT (company_id, employee_id, attendance_date) DO UPDATE SET
           payload = EXCLUDED.payload,
           updated_at = NOW()`,
        [record.id, record.company_id, record.employee_id, record.date, JSON.stringify(record)]
      );
    }
    await client.query('COMMIT');
    console.log(`\nSelesai. ${toUpsert.length} baris absensi ditulis/diperbarui.`);

    await pool.query("SELECT pg_notify('attendance_changes', $1)", [
      JSON.stringify({ collection: 'attendances', id: null, at: new Date().toISOString() }),
    ]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Gagal, transaksi dibatalkan:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
