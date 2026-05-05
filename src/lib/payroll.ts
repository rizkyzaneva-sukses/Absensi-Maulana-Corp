import type { Employee, Attendance, PayrollRecord, Holiday } from '@/types';
import { getWorkingDaysInMonth, countAttendanceDays, sumOvertimeMinutes, generateId } from './attendance';

export interface PayrollInput {
  employee: Employee;
  attendances: Attendance[];
  holidays: Holiday[];
  year: number;
  month: number;
  companyId: string;
  existingRecord?: PayrollRecord;
  lemburRatePerJam?: number;
}

/**
 * Generate payroll for a single employee
 */
export function generateEmployeePayroll(input: PayrollInput): PayrollRecord {
  const { employee, attendances, holidays, year, month, companyId, existingRecord, lemburRatePerJam = 25000 } = input;

  const workingDays = getWorkingDaysInMonth(year, month, holidays, companyId);
  const daysPresent = countAttendanceDays(attendances, employee.id, year, month);
  const overtimeMinutes = sumOvertimeMinutes(attendances, employee.id, year, month);
  const overtimeHours = Math.round((overtimeMinutes / 60) * 100) / 100;

  // Calculate salary components
  const baseSalary = employee.base_salary;
  
  // Transport & Makan are per attendance day
  const transport = daysPresent * (employee.uang_transport || 0);
  const uangMakan = daysPresent * (employee.uang_makan || 0);
  
  // Overtime pay
  const overtimePay = Math.round(overtimeHours * lemburRatePerJam);
  
  // Bonus = uang_kehadiran * days present + tunjangan_kesehatan (fixed monthly)
  const bonus = daysPresent * (employee.uang_kehadiran || 0) + (employee.tunjangan_kesehatan || 0);

  // Deductions
  const absentDays = Math.max(0, workingDays - daysPresent);
  const dailyRate = baseSalary / (workingDays || 1);
  const absenceDeductions = Math.round(absentDays * dailyRate);

  // Late deductions (sum late minutes * rate)
  const lateMinutes = attendances
    .filter((a) => {
      const d = new Date(a.date);
      return a.employee_id === employee.id && d.getFullYear() === year && d.getMonth() + 1 === month;
    })
    .reduce((sum, a) => sum + (a.late_minutes || 0), 0);
  const lateDeductions = lateMinutes * 5000; // Rp 5000 per minute late

  const totalDeductions = absenceDeductions + lateDeductions;

  // Allowances (kept for backward compat)
  const allowances = existingRecord?.allowances || 0;

  const totalPay = baseSalary + transport + uangMakan + overtimePay + bonus + allowances - totalDeductions;

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
    overtime_pay: overtimePay,
    bonus,
    deductions: totalDeductions,
    late_deductions: lateDeductions,
    absence_deductions: absenceDeductions,
    allowances,
    total_pay: Math.max(0, totalPay),
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
  lemburRatePerJam?: number
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
      lemburRatePerJam,
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
