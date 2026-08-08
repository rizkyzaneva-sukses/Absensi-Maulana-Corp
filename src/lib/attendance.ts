import type { Employee, Attendance, Holiday, Notification, AttendanceStatus } from '@/types';
import type { WorkSchedule, OvertimeSettings } from '@/stores/dataStore';

// ============ MANUAL EDIT (ADMIN/MANAGER) HELPERS ============

export const ATTENDANCE_STATUS_OPTIONS: AttendanceStatus[] = [
  'HADIR', 'TERLAMBAT', 'PULANG_CEPAT', 'IZIN', 'IZIN_SEPARUH',
  'SAKIT', 'CUTI', 'DINAS_LUAR', 'TIDAK_HADIR', 'AUTO_CHECKOUT', 'LIBUR',
];

/** Format an ISO timestamp as a local "HH:mm" string for a <input type="time"> field. */
export function isoToTimeInput(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** Combine a "YYYY-MM-DD" date with a "HH:mm" <input type="time"> value into an ISO timestamp. */
export function timeInputToIso(dateStr: string, time: string): string | null {
  if (!time) return null;
  return new Date(`${dateStr}T${time}:00`).toISOString();
}

// ============ SCHEDULE RESOLUTION ============

export interface DaySchedule {
  start: string; // HH:mm
  end: string;   // HH:mm
  is_workday: boolean;
}

const DEFAULT_SCHEDULE: Record<string, DaySchedule> = {
  monday: { start: '08:00', end: '17:00', is_workday: true },
  tuesday: { start: '08:00', end: '17:00', is_workday: true },
  wednesday: { start: '08:00', end: '17:00', is_workday: true },
  thursday: { start: '08:00', end: '17:00', is_workday: true },
  friday: { start: '08:00', end: '17:00', is_workday: true },
  saturday: { start: '08:00', end: '15:00', is_workday: true },
  sunday: { start: '08:00', end: '17:00', is_workday: false },
};

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

/**
 * Resolve work schedule for an employee on a given date.
 * Priority: WorkSchedule (most specific) > Team.work_hours > Default
 */
export function resolveSchedule(
  employee: Employee,
  date: Date,
  workSchedules: WorkSchedule[],
  teamWorkHours?: Record<string, DaySchedule>
): DaySchedule {
  const dayName = DAY_NAMES[date.getDay()];

  // Priority 1: Find WorkSchedule assigned to this employee
  const assignedSchedules = workSchedules.filter(
    (ws) => ws.is_active && ws.employee_emails.includes(employee.user_email)
  );

  if (assignedSchedules.length > 0) {
    // Among schedules with this day as workday, prefer the one with fewer active days (more specific)
    const withWorkday = assignedSchedules.filter(
      (ws) => ws.work_hours[dayName]?.is_workday
    );

    if (withWorkday.length > 0) {
      const mostSpecific = withWorkday.sort((a, b) => {
        const aDays = Object.values(a.work_hours).filter((d) => d.is_workday).length;
        const bDays = Object.values(b.work_hours).filter((d) => d.is_workday).length;
        return aDays - bDays;
      })[0];
      return mostSpecific.work_hours[dayName];
    }

    // If no schedule has this day as workday, check if any schedule defines this day at all
    const withDay = assignedSchedules.find((ws) => ws.work_hours[dayName]);
    if (withDay) {
      return withDay.work_hours[dayName];
    }
  }

  // Priority 2: Team work hours
  if (teamWorkHours && teamWorkHours[dayName]) {
    return teamWorkHours[dayName];
  }

  // Priority 3: Default schedule
  return DEFAULT_SCHEDULE[dayName];
}

// ============ TIME CALCULATIONS ============

/**
 * Parse HH:mm string to minutes since midnight
 */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Convert minutes since midnight to HH:mm string
 */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Calculate late minutes based on actual check-in time vs scheduled start
 */
export function calculateLateMinutes(checkInTime: string, scheduledStart: string): number {
  const checkInDate = new Date(checkInTime);
  const checkInMinutes = checkInDate.getHours() * 60 + checkInDate.getMinutes();
  const scheduledMinutes = timeToMinutes(scheduledStart);
  return Math.max(0, checkInMinutes - scheduledMinutes);
}

/**
 * Calculate early leave minutes based on actual check-out time vs scheduled end
 */
export function calculateEarlyLeaveMinutes(checkOutTime: string, scheduledEnd: string): number {
  const checkOutDate = new Date(checkOutTime);
  const checkOutMinutes = checkOutDate.getHours() * 60 + checkOutDate.getMinutes();
  const scheduledMinutes = timeToMinutes(scheduledEnd);
  return Math.max(0, scheduledMinutes - checkOutMinutes);
}

/**
 * Calculate overtime (lembur) minutes based on check-out time, scheduled end, and settings
 */
export function calculateOvertimeMinutes(
  checkOutTime: string,
  scheduledEnd: string,
  settings: OvertimeSettings
): number {
  const checkOutDate = new Date(checkOutTime);
  const checkOutMinutes = checkOutDate.getHours() * 60 + checkOutDate.getMinutes();
  const scheduledMinutes = timeToMinutes(scheduledEnd);

  const extraMinutes = checkOutMinutes - scheduledMinutes;
  if (extraMinutes <= settings.tolerance_minutes) return 0;

  const lemburMinutes = extraMinutes - settings.tolerance_minutes;
  return Math.min(lemburMinutes, settings.lembur_max_minutes);
}

/**
 * Determine attendance status based on check-in time and schedule.
 * Latest on-time check-in is 07:59; 08:00 (scheduled start) onwards counts as TERLAMBAT.
 */
export function determineCheckInStatus(
  checkInTime: string,
  scheduledStart: string,
  isDinasLuar: boolean
): 'HADIR' | 'TERLAMBAT' | 'DINAS_LUAR' {
  if (isDinasLuar) return 'DINAS_LUAR';
  const checkInDate = new Date(checkInTime);
  const checkInMinutes = checkInDate.getHours() * 60 + checkInDate.getMinutes();
  const scheduledMinutes = timeToMinutes(scheduledStart);
  return checkInMinutes >= scheduledMinutes ? 'TERLAMBAT' : 'HADIR';
}

/**
 * Determine final attendance status after check-out
 */
export function determineCheckOutStatus(
  currentStatus: string,
  earlyLeaveMinutes: number,
  overtimeMinutes: number
): string {
  if (currentStatus === 'DINAS_LUAR') return 'DINAS_LUAR';
  if (earlyLeaveMinutes > 0) return 'PULANG_CEPAT';
  return currentStatus; // Keep HADIR or TERLAMBAT
}

// ============ WORKING DAYS CALCULATION ============

/**
 * Get all working days in a month, excluding Sundays and active holidays.
 * Holiday rules:
 * - Islam holidays: full day off (libur total)
 * - Nasional (Kemerdekaan): full day off
 * - Setengah Hari: still counts as working day (masuk tapi pulang jam 15:00)
 * Only active holidays are considered.
 */
export function getWorkingDaysInMonth(
  year: number,
  month: number, // 1-12
  holidays: Holiday[],
  companyId: string
): number {
  const daysInMonth = new Date(year, month, 0).getDate();
  let workingDays = 0;

  const activeHolidays = holidays.filter(
    (h) => h.company_id === companyId && h.is_active !== false
  );

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();

    // Skip Sundays (default libur)
    if (dayOfWeek === 0) continue;

    // Check holidays for this date
    const dateStr = getDateStr(date);
    const holiday = activeHolidays.find((h) => h.date === dateStr);
    
    if (holiday) {
      // Setengah Hari: still counts as working day (masuk tapi pulang lebih awal)
      if (holiday.type === 'Setengah Hari') {
        workingDays++;
        continue;
      }
      // Islam & Nasional: full day off
      continue;
    }

    workingDays++;
  }

  return workingDays;
}

/**
 * Count attendance days with specific statuses
 */
export function countAttendanceDays(
  attendances: Attendance[],
  employeeId: string,
  year: number,
  month: number,
  validStatuses: string[] = ['HADIR', 'TERLAMBAT', 'PULANG_CEPAT', 'DINAS_LUAR']
): number {
  return attendances.filter((a) => {
    const d = parseDateStr(a.date);
    return (
      a.employee_id === employeeId &&
      d.getFullYear() === year &&
      d.getMonth() + 1 === month &&
      validStatuses.includes(a.status)
    );
  }).length;
}

/**
 * Sum overtime minutes for an employee in a given month
 */
export function sumOvertimeMinutes(
  attendances: Attendance[],
  employeeId: string,
  year: number,
  month: number
): number {
  return attendances
    .filter((a) => {
      const d = parseDateStr(a.date);
      return (
        a.employee_id === employeeId &&
        d.getFullYear() === year &&
        d.getMonth() + 1 === month
      );
    })
    .reduce((sum, a) => sum + (a.overtime_minutes || 0), 0);
}

// ============ ID GENERATION ============

export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// ============ DATE HELPERS ============

export function getTodayStr(): string {
  return getDateStr(new Date());
}

export function getDateStr(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse a "YYYY-MM-DD" date string as a WIB (Asia/Jakarta, UTC+7) calendar date.
 * Using `new Date("YYYY-MM-DD")` would interpret it as UTC midnight and could
 * shift the day in non-WIB contexts, so we build the date from the parts.
 */
export function parseDateStr(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatDateLong(date: string): string {
  return new Date(date).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatTimeFromISO(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getMonthName(month: number): string {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  return months[month - 1] || '';
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

// ============ AUTO-MARK TIDAK_HADIR ============

export function autoMarkAbsent(
  employees: Employee[],
  attendances: Attendance[],
  addAttendance: (r: Attendance) => void,
  companyId: string,
  today: string,
  addNotification: (n: Notification) => void,
  workSchedules: WorkSchedule[],
): void {
  const todayDate = parseDateStr(today);
  const now = new Date();

  const activeEmployees = employees.filter(
    (e) => e.company_id === companyId && e.is_active
  );

  for (const emp of activeEmployees) {
    const hasAttendance = attendances.some(
      (a) => a.employee_id === emp.id && a.company_id === companyId && a.date === today
    );
    if (hasAttendance) continue;

    const schedule = resolveSchedule(emp, todayDate, workSchedules);
    if (!schedule.is_workday) continue;

    // Only auto-mark after scheduled end + 30 min so morning check-in is not blocked
    const endMinutes = timeToMinutes(schedule.end);
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    if (nowMinutes < endMinutes + 30) continue;

    const attendanceId = generateId('att');
    const absentRecord: Attendance = {
      id: attendanceId,
      company_id: companyId,
      employee_id: emp.id,
      date: today,
      check_in_time: null,
      check_out_time: null,
      status: 'TIDAK_HADIR',
      check_in_method: null,
      check_in_location: null,
      check_out_location: null,
      check_in_photo_url: '',
      notes: 'Auto-mark: tidak hadir',
      is_auto_checkout: false,
      overtime_minutes: 0,
      late_minutes: 0,
      early_leave_minutes: 0,
    };
    addAttendance(absentRecord);

    // Notify the employee
    addNotification({
      id: generateId('notif'),
      company_id: companyId,
      user_id: emp.id,
      type: 'SYSTEM',
      title: 'Tidak Hadir',
      message: `Anda tercatat tidak hadir pada ${formatDateLong(today)}.`,
      is_read: false,
      created_at: new Date().toISOString(),
    });

    // Notify managers in the same company
    const managers = employees.filter(
      (e) =>
        e.company_id === companyId &&
        e.is_active &&
        ['MANAGER', 'COO', 'COMPANY_ADMIN'].includes(e.role)
    );
    for (const mgr of managers) {
      addNotification({
        id: generateId('notif'),
        company_id: companyId,
        user_id: mgr.id,
        type: 'SYSTEM',
        title: 'Karyawan Tidak Hadir',
        message: `${emp.full_name} (${emp.position}) tercatat tidak hadir pada ${formatDateLong(today)}.`,
        is_read: false,
        created_at: new Date().toISOString(),
      });
    }
  }
}
