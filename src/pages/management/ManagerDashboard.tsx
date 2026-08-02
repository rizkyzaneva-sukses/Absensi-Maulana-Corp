import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/authStore';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { useDataStore } from '@/stores/dataStore';
import { getTodayStr, getMonthName, autoMarkAbsent } from '@/lib/attendance';
import { getStatusColor, getStatusLabel } from '@/lib/utils';
import {
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  FileText,
  TrendingUp,
  Calendar,
} from 'lucide-react';

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const { currentUser, activeCompany } = useAuthStore();
  const { attendances, leaveRequests, overtimeRequests, corrections, addAttendance } = useAttendanceStore();
  const { holidays, employees, addNotification, workSchedules } = useDataStore();

  const companyId = activeCompany?.id || currentUser?.company_id || '';
  const today = getTodayStr();
  const now = new Date();

  autoMarkAbsent(employees, attendances, addAttendance, companyId, today, addNotification, workSchedules);

  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const companyEmployees = employees.filter(
    (e) => e.company_id === companyId && e.is_active
  );

  // Helper: format time that may be HH:mm or ISO timestamp
  const formatTime = (t: string | null | undefined) => {
    if (!t) return '-';
    if (t.includes('T')) return new Date(t).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    return t;
  };

  // Today's attendance summary
  const todayAttendances = attendances.filter(
    (a) => a.company_id === companyId && a.date === today
  );

  const stats = useMemo(() => {
    const present = todayAttendances.filter((a) =>
      ['HADIR', 'TERLAMBAT'].includes(a.status)
    ).length;
    const late = todayAttendances.filter((a) => a.status === 'TERLAMBAT').length;
    const absent = companyEmployees.length - todayAttendances.length;
    const onLeave = todayAttendances.filter((a) =>
      ['IZIN', 'SAKIT', 'CUTI'].includes(a.status)
    ).length;

    const pendingLeaves = leaveRequests.filter(
      (r) => r.company_id === companyId && r.status === 'PENDING'
    ).length;
    const pendingOT = overtimeRequests.filter(
      (r) => r.company_id === companyId && r.status === 'PENDING'
    ).length;
    const pendingCorr = corrections.filter(
      (c) => c.company_id === companyId && c.status === 'PENDING'
    ).length;

    return { present, late, absent, onLeave, pendingLeaves, pendingOT, pendingCorr };
  }, [todayAttendances, companyEmployees, leaveRequests, overtimeRequests, corrections, companyId]);

  // Today's holiday check
  const todayHoliday = holidays.find(
    (h) => h.company_id === companyId && h.date === today
  );

  // Recent late employees
  const lateToday = todayAttendances
    .filter((a) => a.status === 'TERLAMBAT')
    .map((a) => {
      const emp = companyEmployees.find((e) => e.id === a.employee_id);
      return { ...a, employeeName: emp?.full_name || 'Unknown', lateMin: a.late_minutes };
    })
    .sort((a, b) => b.lateMin - a.lateMin);

  // Employees not yet checked in
  const checkedInIds = new Set(todayAttendances.map((a) => a.employee_id));
  const notCheckedIn = companyEmployees.filter((e) => !checkedInIds.has(e.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard Manager</h1>
        <p className="text-muted-foreground">
          {getMonthName(now.getMonth() + 1)} {now.getFullYear()} • Hari ini: {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        {todayHoliday && (
          <Badge variant="secondary" className="mt-1">
            <Calendar className="h-3 w-3 mr-1" />
            Hari Libur: {todayHoliday.name}
          </Badge>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.present}</p>
                <p className="text-xs text-muted-foreground">Hadir</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-2xl font-bold">{stats.late}</p>
                <p className="text-xs text-muted-foreground">Terlambat</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{stats.absent}</p>
                <p className="text-xs text-muted-foreground">Belum Absen</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.onLeave}</p>
                <p className="text-xs text-muted-foreground">Izin/Cuti</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Menunggu Persetujuan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="justify-between h-auto py-3"
              onClick={() => navigate('/approvals/leave')}
            >
              <span className="text-sm">Cuti/Izin</span>
              <Badge variant={stats.pendingLeaves > 0 ? 'destructive' : 'secondary'}>
                {stats.pendingLeaves}
              </Badge>
            </Button>
            <Button
              variant="outline"
              className="justify-between h-auto py-3"
              onClick={() => navigate('/approvals/overtime')}
            >
              <span className="text-sm">Lembur</span>
              <Badge variant={stats.pendingOT > 0 ? 'destructive' : 'secondary'}>
                {stats.pendingOT}
              </Badge>
            </Button>
            <Button
              variant="outline"
              className="justify-between h-auto py-3"
              onClick={() => navigate('/approvals/correction')}
            >
              <span className="text-sm">Koreksi</span>
              <Badge variant={stats.pendingCorr > 0 ? 'destructive' : 'secondary'}>
                {stats.pendingCorr}
              </Badge>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Late Employees */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              Terlambat Hari Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lateToday.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Tidak ada yang terlambat 🎉
              </p>
            ) : (
              <div className="space-y-2">
                {lateToday.slice(0, 5).map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20"
                  >
                    <span className="text-sm font-medium">{att.employeeName}</span>
                    <span className="text-xs text-amber-600 dark:text-amber-400">
                      +{att.lateMin} menit
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Not Checked In */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Belum Check-in
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notCheckedIn.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Semua karyawan sudah check-in ✓
              </p>
            ) : (
              <div className="space-y-2">
                {notCheckedIn.slice(0, 5).map((emp) => (
                  <div
                    key={emp.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-red-50 dark:bg-red-950/20"
                  >
                    <div>
                      <span className="text-sm font-medium">{emp.full_name}</span>
                      <p className="text-xs text-muted-foreground">{emp.position}</p>
                    </div>
                  </div>
                ))}
                {notCheckedIn.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{notCheckedIn.length - 5} lainnya
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Today's Attendance List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              Absensi Hari Ini
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              {todayAttendances.length}/{companyEmployees.length} karyawan
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-3 text-left font-medium">Karyawan</th>
                  <th className="p-3 text-center font-medium">Check-in</th>
                  <th className="p-3 text-center font-medium">Check-out</th>
                  <th className="p-3 text-center font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {todayAttendances.map((att) => {
                  const emp = companyEmployees.find((e) => e.id === att.employee_id);
                  return (
                    <tr key={att.id} className="hover:bg-muted/30">
                      <td className="p-3">
                        <p className="font-medium">{emp?.full_name || '-'}</p>
                        <p className="text-xs text-muted-foreground">{emp?.position}</p>
                      </td>
                      <td className="p-3 text-center text-xs">
                        {formatTime(att.check_in_time)}
                      </td>
                      <td className="p-3 text-center text-xs">
                        {formatTime(att.check_out_time)}
                      </td>
                      <td className="p-3 text-center">
                        <Badge className={getStatusColor(att.status)} variant="outline">
                          {getStatusLabel(att.status)}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
                {todayAttendances.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-muted-foreground">
                      Belum ada data absensi hari ini
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
