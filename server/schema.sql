CREATE TABLE IF NOT EXISTS app_sync_metadata (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS app_sync_attendance_records (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  attendance_date DATE NOT NULL,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (company_id, employee_id, attendance_date)
);

CREATE INDEX IF NOT EXISTS app_sync_attendance_company_date_idx
  ON app_sync_attendance_records (company_id, attendance_date DESC);

CREATE INDEX IF NOT EXISTS app_sync_attendance_employee_date_idx
  ON app_sync_attendance_records (employee_id, attendance_date DESC);

CREATE INDEX IF NOT EXISTS app_sync_attendance_emp_company_date_idx
  ON app_sync_attendance_records (employee_id, company_id, attendance_date DESC);

CREATE TABLE IF NOT EXISTS app_sync_leave_requests (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS app_sync_leave_company_idx
  ON app_sync_leave_requests (company_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS app_sync_overtime_requests (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS app_sync_overtime_company_idx
  ON app_sync_overtime_requests (company_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS app_sync_attendance_corrections (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS app_sync_corrections_company_idx
  ON app_sync_attendance_corrections (company_id, updated_at DESC);
