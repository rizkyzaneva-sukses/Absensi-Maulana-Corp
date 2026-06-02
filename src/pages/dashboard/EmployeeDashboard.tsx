import { useAuthStore } from '@/stores/authStore';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { useDataStore } from '@/stores/dataStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, FileText, Bell, MapPin, CheckCircle2 } from 'lucide-react';

export default function EmployeeDashboard() {
  const { currentUser, activeCompany } = useAuthStore();
  const { attendances, leaveRequests } = useAttendanceStore();
  const { notifications } = useDataStore();
  const navigate = useNavigate();

  if (!currentUser || !activeCompany) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendances.find(
    a => a.employee_id === currentUser.id && a.company_id === activeCompany.id && a.date === todayStr
  );

  const myRecentAttendance = attendances
    .filter(a => a.employee_id === currentUser.id && a.company_id === activeCompany.id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const myPendingRequests = leaveRequests.filter(
    l => l.employee_id === currentUser.id && l.company_id === activeCompany.id && l.status === 'PENDING'
  );

  const myNotifications = notifications
    .filter(n => n.user_id === currentUser.id && !n.is_read)
    .slice(0, 3);

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Selamat Pagi' : now.getHours() < 17 ? 'Selamat Siang' : 'Selamat Malam';

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{greeting}, {currentUser.full_name.split(' ')[0]}! 👋</h1>
          <p className="text-muted-foreground">{currentUser.position} • {activeCompany.name}</p>
        </div>
        {!todayAttendance && (
          <Button onClick={() => navigate('/check-in')} size="lg" className="gap-2">
            <Clock size={18} />
            Check In Sekarang
          </Button>
        )}
      </div>

      {/* Today Status Card */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Status Hari Ini</p>
              {todayAttendance ? (
                <div className="flex items-center gap-3 mt-1">
                  <StatusBadge status={todayAttendance.status} />
                  <span className="text-sm text-muted-foreground">
                    Check-in: {todayAttendance.check_in_time
                      ? (todayAttendance.check_in_time.includes('T')
                          ? new Date(todayAttendance.check_in_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                          : todayAttendance.check_in_time)
                      : '-'} | Check-out: {todayAttendance.check_out_time
                      ? (todayAttendance.check_out_time.includes('T')
                          ? new Date(todayAttendance.check_out_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                          : todayAttendance.check_out_time)
                      : '-'}
                  </span>
                </div>
              ) : (
                <p className="text-lg font-semibold mt-1">Belum Check In</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/check-in')}>
          <CardContent className="p-4 text-center">
            <MapPin className="w-8 h-8 mx-auto text-primary mb-2" />
            <p className="text-sm font-medium">Check In/Out</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/my-requests')}>
          <CardContent className="p-4 text-center">
            <FileText className="w-8 h-8 mx-auto text-blue-500 mb-2" />
            <p className="text-sm font-medium">Pengajuan</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/my-history')}>
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 mx-auto text-violet-500 mb-2" />
            <p className="text-sm font-medium">Riwayat</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/payslip/latest')}>
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
            <p className="text-sm font-medium">Slip Gaji</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Absensi Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myRecentAttendance.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Belum ada data absensi</p>
              ) : (
              myRecentAttendance.map(att => {
                  const fmt = (t: string | null) => {
                    if (!t) return '-';
                    if (t.includes('T')) return new Date(t).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                    return t;
                  };
                  return (
                    <div key={att.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="text-sm font-medium">{new Date(att.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                        <p className="text-xs text-muted-foreground">{fmt(att.check_in_time)} - {fmt(att.check_out_time)}</p>
                      </div>
                      <StatusBadge status={att.status} />
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notifications & Pending */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notifikasi & Pengajuan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myPendingRequests.map(req => (
                <div key={req.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <FileText className="w-4 h-4 text-amber-500" />
                  <div className="flex-1">
                    <p className="text-sm">{req.type} - {req.reason}</p>
                    <p className="text-xs text-muted-foreground">{req.start_date} s/d {req.end_date}</p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
              ))}
              {myNotifications.map(notif => (
                <div key={notif.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                  <Bell className="w-4 h-4 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm">{notif.title}</p>
                    <p className="text-xs text-muted-foreground">{notif.message}</p>
                  </div>
                </div>
              ))}
              {myPendingRequests.length === 0 && myNotifications.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Tidak ada notifikasi baru</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
