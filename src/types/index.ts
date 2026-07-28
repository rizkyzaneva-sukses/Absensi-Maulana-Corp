export type Role = 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'COO' | 'MANAGER' | 'KARYAWAN';

export type SubscriptionPlan = 'BASIC' | 'PRO' | 'ENTERPRISE';

export type AttendanceStatus =
  | 'HADIR'
  | 'TERLAMBAT'
  | 'PULANG_CEPAT'
  | 'IZIN'
  | 'IZIN_SEPARUH'
  | 'SAKIT'
  | 'CUTI'
  | 'DINAS_LUAR'
  | 'TIDAK_HADIR'
  | 'AUTO_CHECKOUT'
  | 'LIBUR';

export type LeaveType = 'CUTI' | 'IZIN' | 'SAKIT';
export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type CheckInMethod = 'QR' | 'SELFIE' | 'FACE' | 'MANUAL';
export type PayrollStatus = 'DRAFT' | 'PREVIEW' | 'FINALIZED';

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  industry: string;
  address: string;
  npwp: string;
  is_active: boolean;
  owner_email: string;
  subscription_plan: SubscriptionPlan;
  max_employees: number;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  company_id: string;
  user_email: string;
  employee_id: string;
  full_name: string;
  phone: string;
  position: string;
  department: string;
  team_id: string;
  role: Role;
  join_date: string;
  photo_url: string;
  is_active: boolean;
  // Jatah Cuti
  cuti_tahunan: number;
  cuti_sakit: number;
  // Pengaturan Gaji (Fix/Bulan)
  base_salary: number;
  tunjangan_kesehatan: number;
  // Tunjangan per Kehadiran (× hari hadir)
  uang_kehadiran: number;
  uang_transport: number;
  uang_makan: number;
  telegram_chat_id: string;
  created_at: string;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Attendance {
  id: string;
  company_id: string;
  employee_id: string;
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  status: AttendanceStatus;
  check_in_method: CheckInMethod | null;
  check_in_location: GeoPoint | null;
  check_out_location: GeoPoint | null;
  check_in_photo_url: string;
  notes: string;
  is_auto_checkout: boolean;
  overtime_minutes: number;
  late_minutes: number;
  early_leave_minutes: number;
}

export interface LeaveRequest {
  id: string;
  company_id: string;
  employee_id: string;
  employee_name: string;
  type: LeaveType;
  start_date: string;
  end_date: string;
  reason: string;
  status: RequestStatus;
  approved_by: string | null;
  created_at: string;
}

export interface OvertimeRequest {
  id: string;
  company_id: string;
  employee_id: string;
  employee_name: string;
  date: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  reason: string;
  status: RequestStatus;
  approved_by: string | null;
  created_at: string;
}

export interface AttendanceCorrection {
  id: string;
  company_id: string;
  employee_id: string;
  employee_name: string;
  attendance_id: string;
  date: string;
  original_check_in: string | null;
  original_check_out: string | null;
  corrected_check_in: string;
  corrected_check_out: string;
  reason: string;
  status: RequestStatus;
  approved_by: string | null;
  created_at: string;
}

export interface Team {
  id: string;
  company_id: string;
  name: string;
  manager_id: string;
  member_count: number;
}

export interface PayrollRecord {
  id: string;
  company_id: string;
  employee_id: string;
  employee_name: string;
  employee_nik: string;
  period: string; // YYYY-MM
  working_days: number;
  days_present: number;
  base_salary: number;
  transport: number;
  uang_makan: number;
  overtime_pay: number;
  bonus: number;
  deductions: number;
  late_deductions: number;
  absence_deductions: number;
  allowances: number;
  total_pay: number;
  status: PayrollStatus;
  generated_at: string;
  finalized_at: string | null;
}

export interface Notification {
  id: string;
  company_id: string;
  user_id: string;
  type: 'ATTENDANCE' | 'LEAVE' | 'OVERTIME' | 'PAYROLL' | 'SYSTEM';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface CompanyConfig {
  id: string;
  company_id: string;
  config_key: string;
  config_value: string;
  config_type: 'string' | 'number' | 'boolean' | 'json';
}

export type HolidayType = 'Islam' | 'Nasional' | 'Setengah Hari';

export interface Holiday {
  id: string;
  company_id: string;
  name: string;
  date: string;
  type: HolidayType;
  is_national: boolean;
  is_active: boolean;
  early_leave_time?: string | null; // Jam pulang untuk Setengah Hari (e.g. "15:00")
}

export interface Location {
  id: string;
  company_id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  radius_meters: number;
}

export interface AuthUser {
  email: string;
  employee: Employee;
  companies: Company[];
}
