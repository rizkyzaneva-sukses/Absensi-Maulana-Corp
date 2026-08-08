import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { useDataStore } from '@/stores/dataStore';
import { AppLayout } from '@/components/layout/AppLayout';

// Auth pages
import LoginPage from '@/pages/auth/LoginPage';
import CompanyPickerPage from '@/pages/auth/CompanyPickerPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';

// Core pages (eagerly loaded)
import EmployeeDashboard from '@/pages/dashboard/EmployeeDashboard';
import CheckInPage from '@/pages/attendance/CheckInPage';

// Lazy loaded pages
const OwnerDashboard = lazy(() => import('@/pages/owner/OwnerDashboard'));
const OwnerAttendancePage = lazy(() => import('@/pages/owner/OwnerAttendancePage'));
const CheckOutPage = lazy(() => import('@/pages/attendance/CheckOutPage'));
const MyHistoryPage = lazy(() => import('@/pages/attendance/MyHistoryPage'));
const MyRequestsPage = lazy(() => import('@/pages/requests/MyRequestsPage'));
const LeaveRequestForm = lazy(() => import('@/pages/requests/LeaveRequestForm'));
const OvertimeRequestForm = lazy(() => import('@/pages/requests/OvertimeRequestForm'));
const CorrectionRequestForm = lazy(() => import('@/pages/requests/CorrectionRequestForm'));
const LeaveApprovalPage = lazy(() => import('@/pages/management/LeaveApprovalPage'));
const OvertimeApprovalPage = lazy(() => import('@/pages/management/OvertimeApprovalPage'));
const CorrectionApprovalPage = lazy(() => import('@/pages/management/CorrectionApprovalPage'));
const EditAttendancePage = lazy(() => import('@/pages/management/EditAttendancePage'));
const ManagerDashboard = lazy(() => import('@/pages/management/ManagerDashboard'));
const AuditLogPage = lazy(() => import('@/pages/management/AuditLogPage'));
const PrintQRCardsPage = lazy(() => import('@/pages/management/PrintQRCardsPage'));
const RevisionListPage = lazy(() => import('@/pages/management/RevisionListPage'));
const EmployeesPage = lazy(() => import('@/pages/employees/EmployeesPage'));
const PayrollPage = lazy(() => import('@/pages/payroll/PayrollPage'));
const AnalyticsPage = lazy(() => import('@/pages/analytics/AnalyticsPage'));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));
const HolidaySettings = lazy(() => import('@/pages/settings/HolidaySettings'));
const LocationSettings = lazy(() => import('@/pages/settings/LocationSettings'));
const WorkScheduleSettings = lazy(() => import('@/pages/settings/WorkScheduleSettings'));
const OvertimeSettings = lazy(() => import('@/pages/settings/OvertimeSettings'));
const PayrollSettings = lazy(() => import('@/pages/settings/PayrollSettings'));
const UserGuidePage = lazy(() => import('@/pages/guide/UserGuidePage'));
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

const ROLE_ACCESS: Record<string, string[]> = {
  '/owner': ['SUPER_ADMIN'],
  '/owner/attendance': ['SUPER_ADMIN'],
  '/manager': ['MANAGER', 'COO', 'COMPANY_ADMIN', 'SUPER_ADMIN'],
  '/approvals/leave': ['MANAGER', 'COO', 'COMPANY_ADMIN', 'SUPER_ADMIN'],
  '/approvals/overtime': ['MANAGER', 'COO', 'COMPANY_ADMIN', 'SUPER_ADMIN'],
  '/approvals/correction': ['MANAGER', 'COO', 'COMPANY_ADMIN', 'SUPER_ADMIN'],
  '/manager/edit-attendance': ['MANAGER', 'COO', 'COMPANY_ADMIN', 'SUPER_ADMIN'],
  '/audit-log': ['COO', 'COMPANY_ADMIN', 'SUPER_ADMIN'],
  '/print-qr': ['COO', 'COMPANY_ADMIN', 'SUPER_ADMIN'],
  '/revisions': ['COO', 'COMPANY_ADMIN', 'SUPER_ADMIN'],
  '/employees': ['COO', 'COMPANY_ADMIN', 'SUPER_ADMIN'],
  '/payroll': ['COO', 'COMPANY_ADMIN', 'SUPER_ADMIN'],
  '/analytics': ['MANAGER', 'COO', 'COMPANY_ADMIN', 'SUPER_ADMIN'],
  '/settings': ['COO', 'COMPANY_ADMIN', 'SUPER_ADMIN'],
  '/settings/holidays': ['COO', 'COMPANY_ADMIN', 'SUPER_ADMIN'],
  '/settings/locations': ['COO', 'COMPANY_ADMIN', 'SUPER_ADMIN'],
  '/settings/schedules': ['COO', 'COMPANY_ADMIN', 'SUPER_ADMIN'],
  '/settings/overtime': ['COO', 'COMPANY_ADMIN', 'SUPER_ADMIN'],
  '/settings/payroll': ['COO', 'COMPANY_ADMIN', 'SUPER_ADMIN'],
};

function RoleRoute({ children, path }: { children: React.ReactNode; path: string }) {
  const { currentUser } = useAuthStore();
  const allowed = ROLE_ACCESS[path];
  if (allowed && currentUser && !allowed.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

function LazyFallback() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Memuat...</p>
      </div>
    </div>
  );
}

function App() {
  const initializeAttendanceSync = useAttendanceStore((state) => state.initializeSync);
  const initializeEmployeesSync = useDataStore((state) => state.initializeEmployeesSync);

  useEffect(() => {
    void initializeAttendanceSync();
    void initializeEmployeesSync();
  }, [initializeAttendanceSync, initializeEmployeesSync]);

  return (
    <BrowserRouter>
      <Suspense fallback={<LazyFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/pick-company" element={<CompanyPickerPage />} />

          {/* Protected Routes with Layout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route path="/dashboard" element={<EmployeeDashboard />} />
            <Route path="/owner" element={<RoleRoute path="/owner"><OwnerDashboard /></RoleRoute>} />
            <Route path="/owner/attendance" element={<RoleRoute path="/owner/attendance"><OwnerAttendancePage /></RoleRoute>} />

            {/* Attendance */}
            <Route path="/check-in" element={<CheckInPage />} />
            <Route path="/check-out" element={<CheckOutPage />} />
            <Route path="/my-history" element={<MyHistoryPage />} />

            {/* Requests */}
            <Route path="/my-requests" element={<MyRequestsPage />} />
            <Route path="/requests/leave" element={<LeaveRequestForm />} />
            <Route path="/requests/overtime" element={<OvertimeRequestForm />} />
            <Route path="/requests/correction" element={<CorrectionRequestForm />} />

            {/* Management / Approvals */}
            <Route path="/manager" element={<RoleRoute path="/manager"><ManagerDashboard /></RoleRoute>} />
            <Route path="/approvals/leave" element={<RoleRoute path="/approvals/leave"><LeaveApprovalPage /></RoleRoute>} />
            <Route path="/approvals/overtime" element={<RoleRoute path="/approvals/overtime"><OvertimeApprovalPage /></RoleRoute>} />
            <Route path="/approvals/correction" element={<RoleRoute path="/approvals/correction"><CorrectionApprovalPage /></RoleRoute>} />
            <Route path="/manager/edit-attendance" element={<RoleRoute path="/manager/edit-attendance"><EditAttendancePage /></RoleRoute>} />
            <Route path="/audit-log" element={<RoleRoute path="/audit-log"><AuditLogPage /></RoleRoute>} />
            <Route path="/print-qr" element={<RoleRoute path="/print-qr"><PrintQRCardsPage /></RoleRoute>} />
            <Route path="/revisions" element={<RoleRoute path="/revisions"><RevisionListPage /></RoleRoute>} />

            {/* Employees */}
            <Route path="/employees" element={<RoleRoute path="/employees"><EmployeesPage /></RoleRoute>} />

            {/* Payroll */}
            <Route path="/payroll" element={<RoleRoute path="/payroll"><PayrollPage /></RoleRoute>} />
            <Route path="/payslip/:id" element={<RoleRoute path="/payroll"><PayrollPage /></RoleRoute>} />

            {/* Analytics */}
            <Route path="/analytics" element={<RoleRoute path="/analytics"><AnalyticsPage /></RoleRoute>} />

            {/* Settings */}
            <Route path="/settings" element={<RoleRoute path="/settings"><SettingsPage /></RoleRoute>} />
            <Route path="/settings/holidays" element={<RoleRoute path="/settings/holidays"><HolidaySettings /></RoleRoute>} />
            <Route path="/settings/locations" element={<RoleRoute path="/settings/locations"><LocationSettings /></RoleRoute>} />
            <Route path="/settings/schedules" element={<RoleRoute path="/settings/schedules"><WorkScheduleSettings /></RoleRoute>} />
            <Route path="/settings/overtime" element={<RoleRoute path="/settings/overtime"><OvertimeSettings /></RoleRoute>} />
            <Route path="/settings/payroll" element={<RoleRoute path="/settings/payroll"><PayrollSettings /></RoleRoute>} />

            {/* Guide */}
            <Route path="/guide" element={<UserGuidePage />} />

            {/* Profile */}
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
