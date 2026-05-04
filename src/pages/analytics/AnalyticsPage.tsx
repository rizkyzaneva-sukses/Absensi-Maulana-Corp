import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { attendanceRecords, employees } from '@/lib/mock-data';
import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react';

export default function AnalyticsPage() {
  const { activeCompany } = useAuthStore();

  const companyAttendance = attendanceRecords.filter(a => a.company_id === activeCompany?.id);
  const companyEmployees = employees.filter(e => e.company_id === activeCompany?.id && e.is_active);

  const totalRecords = companyAttendance.length;
  const hadirCount = companyAttendance.filter(a => a.status === 'HADIR').length;
  const terlambatCount = companyAttendance.filter(a => a.status === 'TERLAMBAT').length;
  const absentCount = companyAttendance.filter(a => a.status === 'TIDAK_HADIR').length;

  const hadirRate = totalRecords > 0 ? Math.round((hadirCount / totalRecords) * 100) : 0;
  const terlambatRate = totalRecords > 0 ? Math.round((terlambatCount / totalRecords) * 100) : 0;

  // Simple bar chart data simulation
  const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum'];
  const weekData = weekDays.map((day, i) => ({
    day,
    hadir: Math.floor(Math.random() * 5) + companyEmployees.length - 3,
    terlambat: Math.floor(Math.random() * 3),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Statistik kehadiran {activeCompany?.name}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tingkat Kehadiran</p>
                <p className="text-xl font-bold">{hadirRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tingkat Keterlambatan</p>
                <p className="text-xl font-bold">{terlambatRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Record</p>
                <p className="text-xl font-bold">{totalRecords}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tidak Hadir</p>
                <p className="text-xl font-bold">{absentCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Simple Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Kehadiran Minggu Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 h-48">
            {weekData.map(d => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col items-center gap-0.5">
                  <div
                    className="w-full bg-amber-400 rounded-t"
                    style={{ height: `${d.terlambat * 15}px` }}
                    title={`Terlambat: ${d.terlambat}`}
                  />
                  <div
                    className="w-full bg-emerald-500 rounded-t"
                    style={{ height: `${d.hadir * 15}px` }}
                    title={`Hadir: ${d.hadir}`}
                  />
                </div>
                <span className="text-xs text-muted-foreground mt-1">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500" />
              <span className="text-xs text-muted-foreground">Hadir</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-amber-400" />
              <span className="text-xs text-muted-foreground">Terlambat</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Ranking */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ranking Kehadiran Karyawan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {companyEmployees.slice(0, 5).map((emp, i) => {
              const empAttendance = companyAttendance.filter(a => a.employee_id === emp.id);
              const empHadir = empAttendance.filter(a => ['HADIR', 'TERLAMBAT'].includes(a.status)).length;
              const rate = empAttendance.length > 0 ? Math.round((empHadir / empAttendance.length) * 100) : 0;
              return (
                <div key={emp.id} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-muted-foreground w-6">#{i + 1}</span>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                    {emp.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{emp.full_name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${rate}%` }} />
                    </div>
                    <span className="text-sm font-medium w-10 text-right">{rate}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
