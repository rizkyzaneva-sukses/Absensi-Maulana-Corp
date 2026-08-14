const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const PRESENT_STATUSES = new Set(['HADIR', 'TERLAMBAT', 'PULANG_CEPAT', 'AUTO_CHECKOUT']);
const EXCUSED_STATUSES = {
  CUTI: 'Cuti',
  IZIN: 'Izin',
  IZIN_SEPARUH: 'Izin setengah hari',
  SAKIT: 'Sakit',
  DINAS_LUAR: 'Dinas luar',
};

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function getJakartaParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const map = Object.fromEntries(
    parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]),
  );

  let hour = Number(map.hour);
  if (hour === 24) hour = 0;

  const year = Number(map.year);
  const month = Number(map.month);
  const day = Number(map.day);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();

  return {
    year,
    month,
    day,
    hour,
    minute: Number(map.minute),
    second: Number(map.second),
    weekday,
    dateStr: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
  };
}

export function formatJakartaDateLong(dateStr) {
  const [year, month, day] = String(dateStr || '').split('-').map(Number);
  if (!year || !month || !day) return String(dateStr || '');
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return `${HARI[weekday]}, ${day} ${BULAN[month - 1]} ${year}`;
}

export function formatDateRangeId(start, end) {
  const startLabel = formatJakartaDateLong(start);
  if (!end || end === start) return startLabel;
  return `${startLabel} s/d ${formatJakartaDateLong(end)}`;
}

export function leaveTypeLabel(type) {
  if (type === 'CUTI') return 'Cuti';
  if (type === 'IZIN') return 'Izin';
  if (type === 'SAKIT') return 'Sakit';
  return type || 'Izin';
}

export function leaveCoversDate(leave, dateStr) {
  if (!leave?.start_date || !dateStr) return false;
  const end = leave.end_date || leave.start_date;
  return leave.start_date <= dateStr && dateStr <= end;
}

export function isPresentRecord(attendance) {
  if (!attendance) return false;
  if (attendance.check_in_time) return true;
  return PRESENT_STATUSES.has(attendance.status);
}

export function createChannelBindToken() {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
  return `ABSEN-${hex}`;
}

export function extractChannelToken(text) {
  const cleaned = String(text || '')
    .replace(/@\w+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) return null;

  const bind = cleaned.match(/^(?:\/(?:ikat|bind|start))\s+([A-Za-z0-9-]+)/i);
  if (bind) return bind[1].toUpperCase();

  const absen = cleaned.match(/\b(ABSEN-[A-F0-9]{8})\b/i);
  if (absen) return absen[1].toUpperCase();

  return null;
}

function employeeDisplayName(employee) {
  return employee?.full_name || employee?.employee_id || employee?.id || 'Karyawan';
}

export function buildMorningReport({
  companyName,
  dateStr,
  employees = [],
  attendances = [],
  leaveRequests = [],
}) {
  const roster = employees.filter((employee) => (
    employee?.is_active !== false && employee?.role !== 'SUPER_ADMIN'
  ));

  const attendanceByEmployee = new Map();
  for (const record of attendances) {
    if (record?.employee_id) attendanceByEmployee.set(record.employee_id, record);
  }

  const coveringLeaves = leaveRequests.filter((leave) => (
    leaveCoversDate(leave, dateStr) && leave.status !== 'REJECTED'
  ));

  const absences = [];
  let presentCount = 0;
  let offCount = 0;

  for (const employee of roster) {
    const attendance = attendanceByEmployee.get(employee.id);
    if (attendance?.status === 'LIBUR') {
      offCount += 1;
      continue;
    }
    if (isPresentRecord(attendance)) {
      presentCount += 1;
      continue;
    }

    const approved = coveringLeaves.find((leave) => (
      leave.employee_id === employee.id && leave.status === 'APPROVED'
    ));
    if (approved) {
      absences.push({
        employee_id: employee.id,
        name: employeeDisplayName(employee),
        category: approved.type,
        label: leaveTypeLabel(approved.type),
        reason: approved.reason || '',
      });
      continue;
    }

    if (attendance && EXCUSED_STATUSES[attendance.status]) {
      absences.push({
        employee_id: employee.id,
        name: employeeDisplayName(employee),
        category: attendance.status,
        label: EXCUSED_STATUSES[attendance.status],
        reason: attendance.notes || '',
      });
      continue;
    }

    const pending = coveringLeaves.find((leave) => (
      leave.employee_id === employee.id && leave.status === 'PENDING'
    ));
    if (pending) {
      absences.push({
        employee_id: employee.id,
        name: employeeDisplayName(employee),
        category: 'PENDING',
        label: `Pengajuan ${leaveTypeLabel(pending.type)} (belum disetujui)`,
        reason: pending.reason || '',
      });
      continue;
    }

    absences.push({
      employee_id: employee.id,
      name: employeeDisplayName(employee),
      category: 'TANPA_KETERANGAN',
      label: attendance?.status === 'TIDAK_HADIR' ? 'Tidak hadir' : 'Belum absen',
      reason: attendance?.notes || 'Tanpa keterangan',
    });
  }

  absences.sort((left, right) => left.name.localeCompare(right.name, 'id'));

  const dateLabel = formatJakartaDateLong(dateStr);
  const allPresent = absences.length === 0;
  let message = '';

  if (!allPresent) {
    const lines = [
      `📋 <b>Absensi ${escapeHtml(companyName || 'Perusahaan')}</b>`,
      `🗓 ${escapeHtml(dateLabel)}`,
      '⏰ Laporan jam 08.30 WIB',
      '',
      '<b>Tidak masuk / belum absen:</b>',
    ];
    absences.forEach((item, index) => {
      lines.push(`${index + 1}. <b>${escapeHtml(item.name)}</b> — ${escapeHtml(item.label)}`);
      if (item.reason) lines.push(`   ${escapeHtml(item.reason)}`);
    });
    lines.push('');
    lines.push(`Hadir: ${presentCount} dari ${roster.length} karyawan`);
    message = lines.join('\n');
  }

  return {
    date: dateStr,
    dateLabel,
    companyName: companyName || '',
    allPresent,
    absences,
    presentCount,
    offCount,
    employeeCount: roster.length,
    message,
  };
}

export function formatLeaveNotification(request, event = 'SUBMITTED') {
  const typeLabel = leaveTypeLabel(request?.type);
  const name = request?.employee_name || request?.employee_id || 'Karyawan';
  const dateRange = formatDateRangeId(request?.start_date, request?.end_date);

  let emoji = '📨';
  let title = `Pengajuan ${typeLabel} baru`;
  if (event === 'APPROVED') {
    emoji = '✅';
    title = `Pengajuan ${typeLabel} disetujui`;
  } else if (event === 'REJECTED') {
    emoji = '❌';
    title = `Pengajuan ${typeLabel} ditolak`;
  }

  const lines = [
    `${emoji} <b>${escapeHtml(title)}</b>`,
    '',
    `👤 ${escapeHtml(name)}`,
    `📅 ${escapeHtml(dateRange)}`,
  ];
  if (request?.reason) {
    lines.push(`💬 ${escapeHtml(request.reason)}`);
  }
  if (event === 'SUBMITTED' || event === 'PENDING') {
    lines.push('');
    lines.push('Status: Menunggu persetujuan');
  }
  return lines.join('\n');
}

export function isMorningReportWindow(parts, { hour = 8, minute = 30, windowMinutes = 5 } = {}) {
  if (!parts || parts.weekday === 0) return false;
  if (parts.hour !== hour) return false;
  return parts.minute >= minute && parts.minute < minute + windowMinutes;
}
