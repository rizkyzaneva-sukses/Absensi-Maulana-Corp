import type {
  Company, Employee, Attendance, LeaveRequest, OvertimeRequest,
  AttendanceCorrection, Team, PayrollRecord, Notification, Holiday, Location
} from '@/types';

// ============ COMPANIES ============
export const companies: Company[] = [
  {
    id: 'comp_zaneva',
    name: 'ZANEVA',
    slug: 'zaneva',
    logo_url: '',
    industry: 'Retail & Fashion',
    address: 'Jl. Sudirman No. 123, Jakarta',
    npwp: '01.234.567.8-901.000',
    is_active: true,
    owner_email: 'rizky@maulanacorp.com',
    subscription_plan: 'ENTERPRISE',
    max_employees: 100,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 'comp_elyasr',
    name: 'ELYASR',
    slug: 'elyasr',
    logo_url: '',
    industry: 'Technology',
    address: 'Jl. Gatot Subroto No. 456, Jakarta',
    npwp: '02.345.678.9-012.000',
    is_active: true,
    owner_email: 'rizky@maulanacorp.com',
    subscription_plan: 'PRO',
    max_employees: 50,
    created_at: '2024-06-01',
    updated_at: '2024-06-01',
  },
];

// ============ EMPLOYEES ============
export const employees: Employee[] = [
  // SUPER ADMIN (Owner)
  {
    id: 'emp_owner',
    company_id: 'comp_zaneva',
    user_email: 'rizky@maulanacorp.com',
    employee_id: 'OWN-001',
    full_name: 'Rizky Maulana',
    phone: '081234567890',
    position: 'Owner / CEO',
    department: 'Management',
    team_id: 'team_mgmt_z',
    role: 'SUPER_ADMIN',
    join_date: '2024-01-01',
    photo_url: '',
    is_active: true,
    cuti_tahunan: 12,
    cuti_sakit: 12,
    base_salary: 50000000,
    tunjangan_kesehatan: 500000,
    uang_kehadiran: 100000,
    uang_transport: 50000,
    uang_makan: 50000,
    created_at: '2024-01-01',
  },
  // ZANEVA employees
  {
    id: 'emp_z_admin',
    company_id: 'comp_zaneva',
    user_email: 'admin@zaneva.com',
    employee_id: 'ZNV-001',
    full_name: 'Siti Nurhaliza',
    phone: '081234567891',
    position: 'HR Admin',
    department: 'Human Resources',
    team_id: 'team_hr_z',
    role: 'COMPANY_ADMIN',
    join_date: '2024-01-15',
    photo_url: '',
    is_active: true,
    cuti_tahunan: 12,
    cuti_sakit: 12,
    base_salary: 12000000,
    tunjangan_kesehatan: 200000,
    uang_kehadiran: 50000,
    uang_transport: 20000,
    uang_makan: 25000,
    created_at: '2024-01-15',
  },
  {
    id: 'emp_z_mgr',
    company_id: 'comp_zaneva',
    user_email: 'manager@zaneva.com',
    employee_id: 'ZNV-002',
    full_name: 'Budi Santoso',
    phone: '081234567892',
    position: 'Sales Manager',
    department: 'Sales',
    team_id: 'team_sales_z',
    role: 'MANAGER',
    join_date: '2024-02-01',
    photo_url: '',
    is_active: true,
    cuti_tahunan: 12,
    cuti_sakit: 12,
    base_salary: 15000000,
    tunjangan_kesehatan: 300000,
    uang_kehadiran: 60000,
    uang_transport: 30000,
    uang_makan: 30000,
    created_at: '2024-02-01',
  },
  {
    id: 'emp_z_01',
    company_id: 'comp_zaneva',
    user_email: 'andi@zaneva.com',
    employee_id: 'ZNV-003',
    full_name: 'Andi Wijaya',
    phone: '081234567893',
    position: 'Sales Staff',
    department: 'Sales',
    team_id: 'team_sales_z',
    role: 'KARYAWAN',
    join_date: '2024-03-01',
    photo_url: '',
    is_active: true,
    cuti_tahunan: 12,
    cuti_sakit: 12,
    base_salary: 6000000,
    tunjangan_kesehatan: 150000,
    uang_kehadiran: 40000,
    uang_transport: 15000,
    uang_makan: 20000,
    created_at: '2024-03-01',
  },
  {
    id: 'emp_z_02',
    company_id: 'comp_zaneva',
    user_email: 'dewi@zaneva.com',
    employee_id: 'ZNV-004',
    full_name: 'Dewi Lestari',
    phone: '081234567894',
    position: 'Marketing Staff',
    department: 'Marketing',
    team_id: 'team_sales_z',
    role: 'KARYAWAN',
    join_date: '2024-03-15',
    photo_url: '',
    is_active: true,
    cuti_tahunan: 12,
    cuti_sakit: 12,
    base_salary: 6500000,
    tunjangan_kesehatan: 150000,
    uang_kehadiran: 40000,
    uang_transport: 15000,
    uang_makan: 20000,
    created_at: '2024-03-15',
  },
  {
    id: 'emp_z_03',
    company_id: 'comp_zaneva',
    user_email: 'rini@zaneva.com',
    employee_id: 'ZNV-005',
    full_name: 'Rini Susanti',
    phone: '081234567895',
    position: 'Cashier',
    department: 'Operations',
    team_id: 'team_ops_z',
    role: 'KARYAWAN',
    join_date: '2024-04-01',
    photo_url: '',
    is_active: true,
    cuti_tahunan: 12,
    cuti_sakit: 12,
    base_salary: 5500000,
    tunjangan_kesehatan: 100000,
    uang_kehadiran: 35000,
    uang_transport: 10000,
    uang_makan: 20000,
    created_at: '2024-04-01',
  },
  {
    id: 'emp_z_04',
    company_id: 'comp_zaneva',
    user_email: 'fajar@zaneva.com',
    employee_id: 'ZNV-006',
    full_name: 'Fajar Pratama',
    phone: '081234567896',
    position: 'Warehouse Staff',
    department: 'Operations',
    team_id: 'team_ops_z',
    role: 'KARYAWAN',
    join_date: '2024-04-15',
    photo_url: '',
    is_active: true,
    cuti_tahunan: 12,
    cuti_sakit: 12,
    base_salary: 5000000,
    tunjangan_kesehatan: 100000,
    uang_kehadiran: 35000,
    uang_transport: 10000,
    uang_makan: 20000,
    created_at: '2024-04-15',
  },
  // ELYASR employees
  {
    id: 'emp_e_admin',
    company_id: 'comp_elyasr',
    user_email: 'admin@elyasr.com',
    employee_id: 'ELY-001',
    full_name: 'Ahmad Fauzi',
    phone: '081234567897',
    position: 'HR Admin',
    department: 'Human Resources',
    team_id: 'team_hr_e',
    role: 'COMPANY_ADMIN',
    join_date: '2024-06-01',
    photo_url: '',
    is_active: true,
    cuti_tahunan: 12,
    cuti_sakit: 12,
    base_salary: 11000000,
    tunjangan_kesehatan: 200000,
    uang_kehadiran: 50000,
    uang_transport: 20000,
    uang_makan: 25000,
    created_at: '2024-06-01',
  },
  {
    id: 'emp_e_mgr',
    company_id: 'comp_elyasr',
    user_email: 'manager@elyasr.com',
    employee_id: 'ELY-002',
    full_name: 'Maya Putri',
    phone: '081234567898',
    position: 'Tech Lead',
    department: 'Engineering',
    team_id: 'team_eng_e',
    role: 'MANAGER',
    join_date: '2024-06-15',
    photo_url: '',
    is_active: true,
    cuti_tahunan: 12,
    cuti_sakit: 12,
    base_salary: 18000000,
    tunjangan_kesehatan: 300000,
    uang_kehadiran: 75000,
    uang_transport: 30000,
    uang_makan: 35000,
    created_at: '2024-06-15',
  },
  {
    id: 'emp_e_01',
    company_id: 'comp_elyasr',
    user_email: 'doni@elyasr.com',
    employee_id: 'ELY-003',
    full_name: 'Doni Setiawan',
    phone: '081234567899',
    position: 'Frontend Developer',
    department: 'Engineering',
    team_id: 'team_eng_e',
    role: 'KARYAWAN',
    join_date: '2024-07-01',
    photo_url: '',
    is_active: true,
    cuti_tahunan: 12,
    cuti_sakit: 12,
    base_salary: 10000000,
    tunjangan_kesehatan: 200000,
    uang_kehadiran: 50000,
    uang_transport: 20000,
    uang_makan: 25000,
    created_at: '2024-07-01',
  },
  {
    id: 'emp_e_02',
    company_id: 'comp_elyasr',
    user_email: 'lisa@elyasr.com',
    employee_id: 'ELY-004',
    full_name: 'Lisa Permata',
    phone: '081234567800',
    position: 'Backend Developer',
    department: 'Engineering',
    team_id: 'team_eng_e',
    role: 'KARYAWAN',
    join_date: '2024-07-15',
    photo_url: '',
    is_active: true,
    cuti_tahunan: 12,
    cuti_sakit: 12,
    base_salary: 10000000,
    tunjangan_kesehatan: 200000,
    uang_kehadiran: 50000,
    uang_transport: 20000,
    uang_makan: 25000,
    created_at: '2024-07-15',
  },
];

// ============ TEAMS ============
export const teams: Team[] = [
  { id: 'team_mgmt_z', company_id: 'comp_zaneva', name: 'Management', manager_id: 'emp_owner', member_count: 1 },
  { id: 'team_hr_z', company_id: 'comp_zaneva', name: 'Human Resources', manager_id: 'emp_z_admin', member_count: 1 },
  { id: 'team_sales_z', company_id: 'comp_zaneva', name: 'Sales & Marketing', manager_id: 'emp_z_mgr', member_count: 3 },
  { id: 'team_ops_z', company_id: 'comp_zaneva', name: 'Operations', manager_id: 'emp_z_mgr', member_count: 2 },
  { id: 'team_hr_e', company_id: 'comp_elyasr', name: 'Human Resources', manager_id: 'emp_e_admin', member_count: 1 },
  { id: 'team_eng_e', company_id: 'comp_elyasr', name: 'Engineering', manager_id: 'emp_e_mgr', member_count: 3 },
];

// ============ ATTENDANCE (last 7 days for demo) ============
function generateAttendance(): Attendance[] {
  const records: Attendance[] = [];
  const today = new Date();
  const statuses: AttendanceStatus[] = ['HADIR', 'HADIR', 'HADIR', 'TERLAMBAT', 'HADIR', 'HADIR', 'IZIN'];
  const empIds = employees.filter(e => e.role !== 'SUPER_ADMIN').map(e => ({ id: e.id, company_id: e.company_id }));

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) continue; // Skip weekends

    empIds.forEach((emp, idx) => {
      const statusIdx = (dayOffset + idx) % statuses.length;
      const status = statuses[statusIdx];
      const isPresent = ['HADIR', 'TERLAMBAT'].includes(status);
      const lateMin = status === 'TERLAMBAT' ? Math.floor(Math.random() * 30) + 5 : 0;

      records.push({
        id: `att_${emp.id}_${dateStr}`,
        company_id: emp.company_id,
        employee_id: emp.id,
        date: dateStr,
        check_in_time: isPresent ? `${status === 'TERLAMBAT' ? '08' : '07'}:${String(Math.floor(Math.random() * 50) + 10).padStart(2, '0')}` : null,
        check_out_time: isPresent ? `17:${String(Math.floor(Math.random() * 30)).padStart(2, '0')}` : null,
        status,
        check_in_method: isPresent ? 'SELFIE' : null,
        check_in_location: isPresent ? { lat: -6.2088, lng: 106.8456 } : null,
        check_out_location: isPresent ? { lat: -6.2088, lng: 106.8456 } : null,
        check_in_photo_url: '',
        notes: status === 'IZIN' ? 'Keperluan keluarga' : '',
        is_auto_checkout: false,
        overtime_minutes: 0,
        late_minutes: lateMin,
        early_leave_minutes: 0,
      });
    });
  }
  return records;
}

export const attendanceRecords: Attendance[] = generateAttendance();

// ============ LEAVE REQUESTS ============
export const leaveRequests: LeaveRequest[] = [
  {
    id: 'leave_001',
    company_id: 'comp_zaneva',
    employee_id: 'emp_z_01',
    employee_name: 'Andi Wijaya',
    type: 'CUTI',
    start_date: '2026-05-10',
    end_date: '2026-05-12',
    reason: 'Liburan keluarga',
    status: 'PENDING',
    approved_by: null,
    created_at: '2026-05-01',
  },
  {
    id: 'leave_002',
    company_id: 'comp_zaneva',
    employee_id: 'emp_z_02',
    employee_name: 'Dewi Lestari',
    type: 'SAKIT',
    start_date: '2026-05-02',
    end_date: '2026-05-03',
    reason: 'Demam tinggi, sudah ke dokter',
    status: 'APPROVED',
    approved_by: 'emp_z_mgr',
    created_at: '2026-05-02',
  },
  {
    id: 'leave_003',
    company_id: 'comp_elyasr',
    employee_id: 'emp_e_01',
    employee_name: 'Doni Setiawan',
    type: 'IZIN',
    start_date: '2026-05-05',
    end_date: '2026-05-05',
    reason: 'Mengurus dokumen penting',
    status: 'PENDING',
    approved_by: null,
    created_at: '2026-05-03',
  },
];

// ============ OVERTIME REQUESTS ============
export const overtimeRequests: OvertimeRequest[] = [
  {
    id: 'ot_001',
    company_id: 'comp_zaneva',
    employee_id: 'emp_z_01',
    employee_name: 'Andi Wijaya',
    date: '2026-05-03',
    start_time: '17:00',
    end_time: '20:00',
    duration_hours: 3,
    reason: 'Deadline project client',
    status: 'PENDING',
    approved_by: null,
    created_at: '2026-05-03',
  },
  {
    id: 'ot_002',
    company_id: 'comp_elyasr',
    employee_id: 'emp_e_02',
    employee_name: 'Lisa Permata',
    date: '2026-05-02',
    start_time: '17:00',
    end_time: '21:00',
    duration_hours: 4,
    reason: 'Bug fix production',
    status: 'APPROVED',
    approved_by: 'emp_e_mgr',
    created_at: '2026-05-02',
  },
];

// ============ CORRECTIONS ============
export const corrections: AttendanceCorrection[] = [
  {
    id: 'corr_001',
    company_id: 'comp_zaneva',
    employee_id: 'emp_z_03',
    employee_name: 'Rini Susanti',
    attendance_id: 'att_emp_z_03_2026-05-01',
    date: '2026-05-01',
    original_check_in: '08:30',
    original_check_out: null,
    corrected_check_in: '07:55',
    corrected_check_out: '17:00',
    reason: 'Lupa check-in, sudah hadir jam 07:55',
    status: 'PENDING',
    approved_by: null,
    created_at: '2026-05-02',
  },
];

// ============ PAYROLL ============
function generatePayroll(): PayrollRecord[] {
  const records: PayrollRecord[] = [];
  const activeEmps = employees.filter(e => e.role !== 'SUPER_ADMIN');

  activeEmps.forEach(emp => {
    const overtime = Math.floor(Math.random() * 1500000);
    const deductions = Math.floor(Math.random() * 500000);
    const allowances = Math.floor(emp.base_salary * 0.1);
    records.push({
      id: `pay_${emp.id}_2026-04`,
      company_id: emp.company_id,
      employee_id: emp.id,
      employee_name: emp.full_name,
      period: '2026-04',
      base_salary: emp.base_salary,
      overtime_pay: overtime,
      deductions,
      late_deductions: Math.floor(Math.random() * 200000),
      absence_deductions: 0,
      allowances,
      total_pay: emp.base_salary + overtime + allowances - deductions,
      status: 'DRAFT',
      generated_at: '2026-05-01',
      finalized_at: null,
    });
  });
  return records;
}

export const payrollRecords: PayrollRecord[] = generatePayroll();

// ============ NOTIFICATIONS ============
export const notifications: Notification[] = [
  {
    id: 'notif_001',
    company_id: 'comp_zaneva',
    user_id: 'emp_z_mgr',
    type: 'LEAVE',
    title: 'Pengajuan Cuti Baru',
    message: 'Andi Wijaya mengajukan cuti 10-12 Mei 2026',
    is_read: false,
    created_at: '2026-05-01T08:00:00',
  },
  {
    id: 'notif_002',
    company_id: 'comp_zaneva',
    user_id: 'emp_z_mgr',
    type: 'OVERTIME',
    title: 'Pengajuan Lembur Baru',
    message: 'Andi Wijaya mengajukan lembur 3 jam pada 3 Mei 2026',
    is_read: false,
    created_at: '2026-05-03T09:00:00',
  },
  {
    id: 'notif_003',
    company_id: 'comp_zaneva',
    user_id: 'emp_z_01',
    type: 'ATTENDANCE',
    title: 'Reminder Check-Out',
    message: 'Jangan lupa check-out hari ini!',
    is_read: true,
    created_at: '2026-05-02T17:30:00',
  },
  {
    id: 'notif_004',
    company_id: 'comp_zaneva',
    user_id: 'emp_z_admin',
    type: 'PAYROLL',
    title: 'Payroll Siap Direview',
    message: 'Payroll periode April 2026 sudah di-generate dan siap direview',
    is_read: false,
    created_at: '2026-05-01T10:00:00',
  },
  {
    id: 'notif_005',
    company_id: 'comp_elyasr',
    user_id: 'emp_e_mgr',
    type: 'LEAVE',
    title: 'Pengajuan Izin Baru',
    message: 'Doni Setiawan mengajukan izin 5 Mei 2026',
    is_read: false,
    created_at: '2026-05-03T08:30:00',
  },
  {
    id: 'notif_006',
    company_id: 'comp_zaneva',
    user_id: 'emp_z_mgr',
    type: 'ATTENDANCE',
    title: 'Koreksi Absensi Baru',
    message: 'Rini Susanti mengajukan koreksi absensi tanggal 1 Mei 2026',
    is_read: false,
    created_at: '2026-05-02T09:00:00',
  },
];

// ============ HOLIDAYS ============
export const holidays: Holiday[] = [
  { id: 'hol_001', company_id: 'comp_zaneva', name: 'Hari Buruh', date: '2026-05-01', is_national: true },
  { id: 'hol_002', company_id: 'comp_zaneva', name: 'Hari Raya Waisak', date: '2026-05-12', is_national: true },
  { id: 'hol_003', company_id: 'comp_elyasr', name: 'Hari Buruh', date: '2026-05-01', is_national: true },
  { id: 'hol_004', company_id: 'comp_elyasr', name: 'Hari Raya Waisak', date: '2026-05-12', is_national: true },
];

// ============ LOCATIONS ============
export const locations: Location[] = [
  {
    id: 'loc_001',
    company_id: 'comp_zaneva',
    name: 'Kantor Pusat ZANEVA',
    address: 'Jl. Sudirman No. 123, Jakarta',
    lat: -6.2088,
    lng: 106.8456,
    radius_meters: 200,
  },
  {
    id: 'loc_002',
    company_id: 'comp_elyasr',
    name: 'Kantor ELYASR',
    address: 'Jl. Gatot Subroto No. 456, Jakarta',
    lat: -6.2350,
    lng: 106.8220,
    radius_meters: 150,
  },
];

// ============ DEMO ACCOUNTS ============
export const demoAccounts = [
  { email: 'rizky@maulanacorp.com', password: 'admin123', label: 'Owner (Super Admin)' },
  { email: 'admin@zaneva.com', password: 'admin123', label: 'Admin ZANEVA' },
  { email: 'manager@zaneva.com', password: 'admin123', label: 'Manager ZANEVA' },
  { email: 'andi@zaneva.com', password: 'admin123', label: 'Karyawan ZANEVA' },
  { email: 'admin@elyasr.com', password: 'admin123', label: 'Admin ELYASR' },
  { email: 'manager@elyasr.com', password: 'admin123', label: 'Manager ELYASR' },
  { email: 'doni@elyasr.com', password: 'admin123', label: 'Karyawan ELYASR' },
];

export type AttendanceStatus = import('@/types').AttendanceStatus;
