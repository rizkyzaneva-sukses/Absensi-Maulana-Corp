/**
 * Script to convert backup_data_2026-05-05_2011.json into mock-data.ts format
 * Run with: node scripts/convert-backup.js
 */
const fs = require('fs');
const path = require('path');

// Read backup data
const backupPath = path.join(__dirname, '..', 'backup_data_2026-05-05_2011.json');
const backup = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
const data = backup.data;

// ============ EMPLOYEE MAPPING ============
// Map backup employee_id to internal app id
const employeeIdMap = {
    'OWN-1': 'emp_owner',
    'ADM01': 'emp_adm01',
    'EL-EM-04': 'emp_el_04',
    'EL-EM-03': 'emp_el_03',
    'EL-EM-02': 'emp_el_02',
    'EL-EM-01': 'emp_el_01',
    'EMP001': 'emp_asfi',
};

const emailToInternalId = {};
data.employees.forEach(emp => {
    emailToInternalId[emp.user_email] = employeeIdMap[emp.employee_id] || emp.id;
});

// Map backup role to app role
function mapRole(role) {
    switch (role) {
        case 'ADMIN': return 'SUPER_ADMIN';
        case 'KARYAWAN': return 'KARYAWAN';
        default: return 'KARYAWAN';
    }
}

// Map attendance method
function mapMethod(method) {
    switch (method) {
        case 'QR_SCAN': return 'QR';
        case 'SELFIE': return 'SELFIE';
        case 'FACE': return 'FACE';
        case 'MANUAL': return 'MANUAL';
        default: return 'QR';
    }
}

// Convert check_in_time ISO to HH:MM format
function isoToTime(isoStr) {
    if (!isoStr) return null;
    // The times are in UTC, convert to UTC+7
    const d = new Date(isoStr);
    const utc7 = new Date(d.getTime() + 7 * 60 * 60 * 1000);
    const h = String(utc7.getUTCHours()).padStart(2, '0');
    const m = String(utc7.getUTCMinutes()).padStart(2, '0');
    return `${h}:${m}`;
}

// ============ GENERATE EMPLOYEES ============
const companyId = 'comp_elyasr';

const employeesOutput = data.employees.map(emp => {
    const internalId = employeeIdMap[emp.employee_id];
    let role = mapRole(emp.role);
    // Special case: OWN-1 is SUPER_ADMIN, EMP001 is also ADMIN but inactive
    if (emp.employee_id === 'OWN-1') role = 'SUPER_ADMIN';
    else if (emp.employee_id === 'ADM01') role = 'COMPANY_ADMIN';
    else if (emp.employee_id === 'EMP001') role = 'SUPER_ADMIN';

    return {
        id: internalId,
        company_id: companyId,
        user_email: emp.user_email,
        employee_id: emp.employee_id,
        full_name: emp.full_name,
        phone: emp.phone || '',
        position: emp.position || '',
        department: emp.department || '',
        team_id: 'team_elyasr',
        role: role,
        join_date: emp.join_date || emp.created_date.split('T')[0],
        photo_url: emp.photo_url || '',
        is_active: emp.is_active,
        cuti_tahunan: emp.leave_balance ? emp.leave_balance.annual_leave : 12,
        cuti_sakit: emp.leave_balance ? emp.leave_balance.sick_leave : 12,
        base_salary: emp.gaji_pokok || 0,
        tunjangan_kesehatan: emp.tunjangan_kesehatan || 0,
        uang_kehadiran: emp.uang_kehadiran || 0,
        uang_transport: emp.uang_transport || 0,
        uang_makan: emp.uang_makan || 0,
        created_at: emp.created_date.split('T')[0],
    };
});

// ============ GENERATE ATTENDANCE ============
const attendancesOutput = data.attendances.map((att, idx) => {
    const empInternalId = emailToInternalId[att.employee_email] || 'emp_unknown';
    const status = att.status || 'HADIR';
    const isPresent = ['HADIR', 'TERLAMBAT', 'PULANG_CEPAT'].includes(status);

    return {
        id: att.id || `att_${idx}`,
        company_id: companyId,
        employee_id: empInternalId,
        date: att.date,
        check_in_time: isoToTime(att.check_in_time),
        check_out_time: isoToTime(att.check_out_time),
        status: status,
        check_in_method: att.attendance_method ? mapMethod(att.attendance_method) : (isPresent ? 'QR' : null),
        check_in_location: att.check_in_location ? { lat: att.check_in_location.latitude, lng: att.check_in_location.longitude } : null,
        check_out_location: att.check_out_location ? { lat: att.check_out_location.latitude, lng: att.check_out_location.longitude } : null,
        check_in_photo_url: att.check_in_photo_url || '',
        notes: att.notes || '',
        is_auto_checkout: false,
        overtime_minutes: att.overtime_minutes || att.lembur_minutes || 0,
        late_minutes: att.late_minutes || 0,
        early_leave_minutes: att.early_leave_minutes || 0,
    };
});

// ============ GENERATE HOLIDAYS ============
const holidaysOutput = data.holidays.filter(h => h.is_active).map(h => {
    return {
        id: h.id,
        company_id: companyId,
        name: h.name,
        date: h.date,
        is_national: h.type === 'NASIONAL',
    };
});

// ============ GENERATE PAYROLL ============
const payrollOutput = data.salaries.map(sal => {
    const empInternalId = emailToInternalId[sal.employee_email] || 'emp_unknown';
    const period = `${sal.year}-${String(sal.month).padStart(2, '0')}`;

    // Map bonus: combine bonus_teamwork + bonus_lain + reward_omset + leadership
    const bonus = (sal.bonus_teamwork || 0) + (sal.bonus_lain || 0) + (sal.reward_omset || 0) + (sal.leadership || 0);
    // Map deductions: potongan_1 + potongan_2
    const deductions = (sal.potongan_1 || 0) + (sal.potongan_2 || 0);

    // Map status
    let status = 'DRAFT';
    if (sal.status === 'FINAL') status = 'FINALIZED';
    else if (sal.status === 'PREVIEW') status = 'PREVIEW';

    return {
        id: sal.id,
        company_id: companyId,
        employee_id: empInternalId,
        employee_name: sal.employee_name,
        employee_nik: sal.nik || sal.employee_id,
        period: period,
        working_days: sal.hari_kerja || 0,
        days_present: sal.hari_hadir || 0,
        base_salary: sal.gaji_pokok || 0,
        transport: sal.transport || 0,
        uang_makan: sal.uang_makan || 0,
        overtime_pay: sal.lembur_total || 0,
        bonus: bonus,
        deductions: deductions,
        late_deductions: 0,
        absence_deductions: 0,
        allowances: (sal.uang_kehadiran || 0) + (sal.tunjangan_kesehatan || 0),
        total_pay: sal.gaji_bersih || 0,
        status: status,
        generated_at: sal.created_date ? sal.created_date.split('T')[0] : '2026-05-01',
        finalized_at: status === 'FINALIZED' ? (sal.updated_date ? sal.updated_date.split('T')[0] : null) : null,
    };
});

// ============ GENERATE LOCATIONS ============
const locationsOutput = data.locations ? data.locations.map(loc => ({
    id: loc.id,
    company_id: companyId,
    name: loc.name,
    address: loc.address || '',
    lat: loc.latitude || loc.lat || 0,
    lng: loc.longitude || loc.lng || 0,
    radius_meters: loc.radius_meters || loc.radius || 200,
})) : [];

// ============ GENERATE WORK SCHEDULES ============
const workSchedulesOutput = data.workSchedules ? data.workSchedules.map(ws => {
    const workHours = {};
    if (ws.work_hours) {
        Object.keys(ws.work_hours).forEach(day => {
            const dayData = ws.work_hours[day];
            workHours[day] = {
                start: dayData.start || dayData.start_time || '08:00',
                end: dayData.end || dayData.end_time || '17:00',
                is_workday: dayData.is_workday !== undefined ? dayData.is_workday : true,
            };
        });
    }
    return {
        id: ws.id,
        company_id: companyId,
        name: ws.name || 'Default Schedule',
        description: ws.description || '',
        employee_emails: ws.employee_emails || [],
        work_hours: workHours,
        is_active: ws.is_active !== undefined ? ws.is_active : true,
    };
}) : [];

// ============ GENERATE LEAVE REQUESTS ============
const leaveRequestsOutput = data.leaveRequests ? data.leaveRequests.map(lr => {
    const empInternalId = emailToInternalId[lr.employee_email] || 'emp_unknown';
    return {
        id: lr.id,
        company_id: companyId,
        employee_id: empInternalId,
        employee_name: lr.employee_name || '',
        type: lr.type || 'CUTI',
        start_date: lr.start_date,
        end_date: lr.end_date,
        reason: lr.reason || '',
        status: lr.status || 'PENDING',
        approved_by: lr.approved_by || null,
        created_at: lr.created_date ? lr.created_date.split('T')[0] : '',
    };
}) : [];

// ============ WRITE OUTPUT ============
// Now generate the TypeScript file
let output = `import type {
  Company, Employee, Attendance, LeaveRequest, OvertimeRequest,
  AttendanceCorrection, Team, PayrollRecord, Notification, Holiday, Location
} from '@/types';

// ============ COMPANIES ============
export const companies: Company[] = [
  {
    id: 'comp_elyasr',
    name: 'ELYASR',
    slug: 'elyasr',
    logo_url: '',
    industry: 'Retail & Fashion',
    address: 'Bandung, Jawa Barat',
    npwp: '01.234.567.8-901.000',
    is_active: true,
    owner_email: 'rizkyzaneva@gmail.com',
    subscription_plan: 'ENTERPRISE',
    max_employees: 100,
    created_at: '2026-01-21',
    updated_at: '2026-05-05',
  },
];

// ============ EMPLOYEES ============
export const employees: Employee[] = ${JSON.stringify(employeesOutput, null, 2)};

// ============ TEAMS ============
export const teams: Team[] = [
  { id: 'team_elyasr', company_id: 'comp_elyasr', name: 'ELYASR Team', manager_id: 'emp_owner', member_count: ${data.employees.length} },
];

// ============ ATTENDANCE ============
export const attendanceRecords: Attendance[] = ${JSON.stringify(attendancesOutput, null, 2)};

// ============ LEAVE REQUESTS ============
export const leaveRequests: LeaveRequest[] = ${JSON.stringify(leaveRequestsOutput, null, 2)};

// ============ OVERTIME REQUESTS ============
export const overtimeRequests: OvertimeRequest[] = [];

// ============ CORRECTIONS ============
export const corrections: AttendanceCorrection[] = [];

// ============ PAYROLL ============
export const payrollRecords: PayrollRecord[] = ${JSON.stringify(payrollOutput, null, 2)};

// ============ NOTIFICATIONS ============
export const notifications: Notification[] = [];

// ============ HOLIDAYS ============
export const holidays: Holiday[] = ${JSON.stringify(holidaysOutput, null, 2)};

// ============ LOCATIONS ============
export const locations: Location[] = ${JSON.stringify(locationsOutput, null, 2)};

// ============ DEMO ACCOUNTS ============
export const demoAccounts = [
  { email: 'rizkyzaneva@gmail.com', password: 'admin123', label: 'Owner (Super Admin)' },
  { email: 'asfizaneva@gmail.com', password: 'admin123', label: 'Admin ELYASR' },
  { email: 'financeelyasr@gmail.com', password: 'admin123', label: 'Karyawan - Salma' },
  { email: 'creativeelyasrnew@gmail.com', password: 'admin123', label: 'Karyawan - Mawar' },
  { email: 'cselyasrsukses@gmail.com', password: 'admin123', label: 'Karyawan - Desil' },
  { email: 'annisanurafifahh@gmail.com', password: 'admin123', label: 'Karyawan - Annisa' },
  { email: 'yasrikhaira1@gmail.com', password: 'admin123', label: 'Admin - Yasri Khaira' },
];

export type AttendanceStatus = import('@/types').AttendanceStatus;
`;

// Fix: replace "null" strings with null
output = output.replace(/"FINALIZED"/g, "'FINALIZED'");

const outputPath = path.join(__dirname, '..', 'src', 'lib', 'mock-data.ts');
fs.writeFileSync(outputPath, output, 'utf-8');

console.log('✅ mock-data.ts generated successfully!');
console.log(`   Employees: ${employeesOutput.length}`);
console.log(`   Attendance records: ${attendancesOutput.length}`);
console.log(`   Holidays: ${holidaysOutput.length}`);
console.log(`   Payroll records: ${payrollOutput.length}`);
console.log(`   Leave requests: ${leaveRequestsOutput.length}`);
console.log(`   Locations: ${locationsOutput.length}`);
console.log(`   Work schedules: ${workSchedulesOutput.length}`);
