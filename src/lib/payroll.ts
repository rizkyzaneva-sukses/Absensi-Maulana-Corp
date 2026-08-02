import type { Employee, Attendance, PayrollRecord, Holiday } from '@/types';
import { getWorkingDaysInMonth, countAttendanceDays, generateId, parseDateStr } from './attendance';

export interface OvertimeConfig {
  tolerance_minutes: number;
  lembur_max_minutes: number;
}

export interface PayrollInput {
  employee: Employee;
  attendances: Attendance[];
  holidays: Holiday[];
  year: number;
  month: number;
  companyId: string;
  existingRecord?: PayrollRecord;
  overtimeConfig: OvertimeConfig;
}

/**
 * Get the overtime minutes that count toward payroll for a single attendance record.
 *
 * `attendance.overtime_minutes` is ALREADY the final lembur value: it was computed
 * at checkout by `calculateOvertimeMinutes` (extra minutes beyond scheduled end,
 * minus tolerance, then capped at lembur_max_minutes). Re-applying tolerance/max
 * here would double-count, so we only re-clamp the cap in case settings changed.
 */
function calculateOvertimeMinutesFromRecord(
  attendance: Attendance,
  _toleranceMinutes: number,
  maxMinutes: number
): number {
  const lemburMinutes = attendance.overtime_minutes || 0;
  return Math.max(0, Math.min(lemburMinutes, maxMinutes));
}

/**
 * Generate payroll for a single employee
 * 
 * Formula:
 * - lembur_rate_per_jam = gaji_pokok / (hari_kerja × 8)
 * - total_lembur_jam = SUM(lembur_minutes) / 60
 * - lembur_total = total_lembur_jam × lembur_rate_per_jam
 * - transport = hari_hadir × uang_transport
 * - makan = hari_hadir × uang_makan
 * - bonus = hari_hadir × uang_kehadiran + tunjangan_kesehatan
 * - total = gaji_pokok + transport + makan + lembur + bonus - potongan(0)
 */
export function generateEmployeePayroll(input: PayrollInput): PayrollRecord {
  const { employee, attendances, holidays, year, month, companyId, existingRecord, overtimeConfig } = input;

  const workingDays = getWorkingDaysInMonth(year, month, holidays, companyId);
  const daysPresent = countAttendanceDays(attendances, employee.id, year, month);

  // Calculate overtime using per-employee rate
  // lembur_rate_per_jam = gaji_pokok / (hari_kerja × 8)
  const lemburRatePerJam = workingDays > 0 ? employee.base_salary / (workingDays * 8) : 0;

  // Get all attendance records for this employee in this month
  const monthAttendances = attendances.filter((a) => {
    const d = parseDateStr(a.date);
    return a.employee_id === employee.id && d.getFullYear() === year && d.getMonth() + 1 === month;
  });

  // Sum lembur minutes with tolerance and max applied
  const totalLemburMinutes = monthAttendances.reduce((sum, a) => {
    return sum + calculateOvertimeMinutesFromRecord(a, overtimeConfig.tolerance_minutes, overtimeConfig.lembur_max_minutes);
  }, 0);

  const totalLemburJam = totalLemburMinutes / 60;
  const overtimePay = Math.round(totalLemburJam * lemburRatePerJam * 10) / 10;

  // Salary components
  const baseSalary = employee.base_salary;
  const transport = daysPresent * (employee.uang_transport || 0);
  const uangMakan = daysPresent * (employee.uang_makan || 0);
  const bonus = daysPresent * (employee.uang_kehadiran || 0) + (employee.tunjangan_kesehatan || 0);

  // No deductions (no late penalty, no absence penalty)
  const deductions = 0;

  const totalPay = baseSalary + transport + uangMakan + overtimePay + bonus - deductions;

  const period = `${year}-${month.toString().padStart(2, '0')}`;

  return {
    id: existingRecord?.id || generateId('pay'),
    company_id: companyId,
    employee_id: employee.id,
    employee_name: employee.full_name,
    employee_nik: employee.employee_id,
    period,
    working_days: workingDays,
    days_present: daysPresent,
    base_salary: baseSalary,
    transport,
    uang_makan: uangMakan,
    overtime_pay: Math.round(overtimePay * 10) / 10,
    bonus,
    deductions,
    late_deductions: 0,
    absence_deductions: 0,
    allowances: 0,
    total_pay: Math.max(0, Math.round(totalPay * 10) / 10),
    status: existingRecord?.status || 'DRAFT',
    generated_at: new Date().toISOString(),
    finalized_at: existingRecord?.finalized_at || null,
  };
}

/**
 * Generate payroll for all active employees in a company
 */
export function generateCompanyPayroll(
  employees: Employee[],
  attendances: Attendance[],
  holidays: Holiday[],
  year: number,
  month: number,
  companyId: string,
  existingRecords: PayrollRecord[],
  overtimeConfig: OvertimeConfig
): PayrollRecord[] {
  const activeEmployees = employees.filter(
    (e) => e.company_id === companyId && e.is_active
  );

  return activeEmployees.map((employee) => {
    const existing = existingRecords.find(
      (r) => r.employee_id === employee.id && r.period === `${year}-${month.toString().padStart(2, '0')}`
    );

    return generateEmployeePayroll({
      employee,
      attendances,
      holidays,
      year,
      month,
      companyId,
      existingRecord: existing,
      overtimeConfig,
    });
  });
}

/**
 * Export payroll data to CSV string
 */
export function exportPayrollToCSV(records: PayrollRecord[]): string {
  const headers = [
    'NIK', 'Nama', 'Periode', 'Hari Kerja', 'Hadir', 'Gaji Pokok', 'Transport', 'Makan',
    'Lembur', 'Bonus', 'Potongan', 'Gaji Bersih', 'Status'
  ];

  const rows = records.map((r) => [
    r.employee_nik,
    r.employee_name,
    r.period,
    r.working_days,
    r.days_present,
    r.base_salary,
    r.transport,
    r.uang_makan,
    r.overtime_pay,
    r.bonus,
    r.deductions,
    r.total_pay,
    r.status,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n');

  return csvContent;
}

/**
 * Download CSV file
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
