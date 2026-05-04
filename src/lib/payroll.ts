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
}

/**
 * Generate payroll for a single employee
 */
export function generateEmployeePayroll(input: PayrollInput): PayrollRecord {
  const { employee, attendances, holidays, year, month, companyId, existingRecord } = input;

  const workingDays = getWorkingDaysInMonth(year, month, holidays, companyId);
  const daysPresent = countAttendanceDays(attendances, employee.id, year, month);
  const overtimeMinutes = sumOvertimeMinutes(attendances, employee.id, year, month);
  const overtimeHours = Math.round((overtimeMinutes / 60) * 100) / 100;

  // Calculate salary components
  const baseSalary = employee.base_salary;
  const overtimePay = Math.round(overtimeHours * (baseSalary / (workingDays * 8)));
  
  // Deductions
  const absentDays = Math.max(0, workingDays - daysPresent);
  const dailyRate = baseSalary / workingDays;
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

  // Allowances (simplified - could be expanded)
  const allowances = existingRecord?.allowances || 0;

  const totalPay = baseSalary + overtimePay + allowances - totalDeductions;

  const period = `${year}-${month.toString().padStart(2, '0')}`;

  return {
    id: existingRecord?.id || generateId('pay'),
    company_id: companyId,
    employee_id: employee.id,
    employee_name: employee.full_name,
    period,
    base_salary: baseSalary,
    overtime_pay: overtimePay,
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
  existingRecords: PayrollRecord[]
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
    });
  });
}

/**
 * Export payroll data to CSV string
 */
export function exportPayrollToCSV(records: PayrollRecord[]): string {
  const headers = [
    'Nama', 'Periode', 'Gaji Pokok', 'Lembur', 'Tunjangan',
    'Potongan Absen', 'Potongan Terlambat', 'Total Potongan', 'Total Gaji', 'Status'
  ];

  const rows = records.map((r) => [
    r.employee_name,
    r.period,
    r.base_salary,
    r.overtime_pay,
    r.allowances,
    r.absence_deductions,
    r.late_deductions,
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
