import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { AppLayout } from '@/components/layout/AppLayout';

// Auth pages
import LoginPage from '@/pages/auth/LoginPage';
import CompanyPickerPage from '@/pages/auth/CompanyPickerPage';

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
  return (
    <BrowserRouter>
      <Suspense fallback={<LazyFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
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
            <Route path="/owner" element={<OwnerDashboard />} />
            <Route path="/owner/attendance" element={<OwnerAttendancePage />} />

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
            <Route path="/manager" element={<ManagerDashboard />} />
            <Route path="/approvals/leave" element={<LeaveApprovalPage />} />
            <Route path="/approvals/overtime" element={<OvertimeApprovalPage />} />
            <Route path="/approvals/correction" element={<CorrectionApprovalPage />} />
            <Route path="/audit-log" element={<AuditLogPage />} />
            <Route path="/print-qr" element={<PrintQRCardsPage />} />
            <Route path="/revisions" element={<RevisionListPage />} />

            {/* Employees */}
            <Route path="/employees" element={<EmployeesPage />} />

            {/* Payroll */}
            <Route path="/payroll" element={<PayrollPage />} />
            <Route path="/payslip/:id" element={<PayrollPage />} />

            {/* Analytics */}
            <Route path="/analytics" element={<AnalyticsPage />} />

            {/* Settings */}
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/holidays" element={<HolidaySettings />} />
            <Route path="/settings/locations" element={<LocationSettings />} />
            <Route path="/settings/schedules" element={<WorkScheduleSettings />} />
            <Route path="/settings/overtime" element={<OvertimeSettings />} />
            <Route path="/settings/payroll" element={<PayrollSettings />} />

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
