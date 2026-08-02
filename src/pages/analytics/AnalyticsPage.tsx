import { useMemo } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { useDataStore } from '@/stores/dataStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, Clock, Timer, Award, Building2, Target } from 'lucide-react';
import { getDateStr, getMonthName } from '@/lib/attendance';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function getISOWeekKey(date: Date): string {
  const year = date.getFullYear();
  const week = String(getWeekNumber(date)).padStart(2, '0');
  return `${year}-W${week}`;
}

export default function AnalyticsPage() {
  const { activeCompany } = useAuthStore();
  const { attendances } = useAttendanceStore();
  const { employees } = useDataStore();

  const companyAttendance = useMemo(
    () => attendances.filter(a => a.company_id === activeCompany?.id),
    [attendances, activeCompany?.id],
  );
  const companyEmployees = useMemo(
    () => employees.filter(e => e.company_id === activeCompany?.id && e.is_active),
    [employees, activeCompany?.id],
  );

  const totalRecords = companyAttendance.length;
  const hadirCount = companyAttendance.filter(a => a.status === 'HADIR').length;
  const terlambatCount = companyAttendance.filter(a => a.status === 'TERLAMBAT').length;
  const absentCount = companyAttendance.filter(a => a.status === 'TIDAK_HADIR').length;

  const hadirRate = totalRecords > 0 ? Math.round((hadirCount / totalRecords) * 100) : 0;
  const terlambatRate = totalRecords > 0 ? Math.round((terlambatCount / totalRecords) * 100) : 0;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const weekDayLabels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const weekData = weekDayLabels.map((day, i) => {
    const date = new Date(now);
    const currentDay = now.getDay();
    const diff = (i + 1) - currentDay;
    date.setDate(now.getDate() + diff);
    const dateStr = getDateStr(date);
    const dayRecords = companyAttendance.filter(a => a.date === dateStr);
    return {
      day,
      hadir: dayRecords.filter(a => a.status === 'HADIR').length,
      terlambat: dayRecords.filter(a => a.status === 'TERLAMBAT').length,
    };
  });

  // 1. Monthly Trend Chart — per week for last 8 weeks
  const weeklyTrend = useMemo(() => {
    const weeks = new Map<string, { hadir: number; terlambat: number; tidakHadir: number; total: number }>();
    const today = new Date();
    for (let i = 49; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = getISOWeekKey(d);
      if (!weeks.has(key)) weeks.set(key, { hadir: 0, terlambat: 0, tidakHadir: 0, total: 0 });
    }
    for (const a of companyAttendance) {
      const d = new Date(a.date + 'T00:00:00');
      const key = getISOWeekKey(d);
      const entry = weeks.get(key);
      if (entry) {
        entry.total++;
        if (a.status === 'HADIR') entry.hadir++;
        else if (a.status === 'TERLAMBAT') entry.terlambat++;
        else if (a.status === 'TIDAK_HADIR') entry.tidakHadir++;
      }
    }
    const sorted = [...weeks.entries()].slice(-8);
    return sorted.map(([key, v]) => ({
      week: key.slice(-5),
      hadirPct: v.total > 0 ? Math.round((v.hadir / v.total) * 100) : 0,
      terlambatPct: v.total > 0 ? Math.round((v.terlambat / v.total) * 100) : 0,
      tidakHadirPct: v.total > 0 ? Math.round((v.tidakHadir / v.total) * 100) : 0,
    }));
  }, [companyAttendance]);

  // 2. Overtime Overview
  const overtimeData = useMemo(() => {
    const monthAttendance = companyAttendance.filter(a => {
      const d = new Date(a.date + 'T00:00:00');
      return d.getFullYear() === currentYear && d.getMonth() + 1 === currentMonth;
    });
    const totalOvertimeMinutes = monthAttendance.reduce((s, a) => s + (a.overtime_minutes || 0), 0);
    const totalOvertimeHours = Math.round((totalOvertimeMinutes / 60) * 10) / 10;

    const empMap = new Map<string, number>();
    for (const a of monthAttendance) {
      empMap.set(a.employee_id, (empMap.get(a.employee_id) || 0) + (a.overtime_minutes || 0));
    }
    const top3 = [...empMap.entries()]
      .map(([eid, mins]) => ({
        employee: companyEmployees.find(e => e.id === eid),
        hours: Math.round((mins / 60) * 10) / 10,
      }))
      .filter(x => x.employee)
      .sort((a, b) => b.hours - a.hours)
      .slice(0, 3);

    return { totalOvertimeHours, top3 };
  }, [companyAttendance, companyEmployees, currentYear, currentMonth]);

  // 3. Late Frequency Leaderboard
  const lateLeaderboard = useMemo(() => {
    const empMap = new Map<string, { count: number; totalLateMins: number }>();
    for (const a of companyAttendance) {
      if (a.status === 'TERLAMBAT') {
        const entry = empMap.get(a.employee_id) || { count: 0, totalLateMins: 0 };
        entry.count++;
        entry.totalLateMins += (a.late_minutes || 0);
        empMap.set(a.employee_id, entry);
      }
    }
    return [...empMap.entries()]
      .map(([eid, v]) => ({
        employee: companyEmployees.find(e => e.id === eid),
        totalLate: v.count,
        avgLateMinutes: v.count > 0 ? Math.round(v.totalLateMins / v.count) : 0,
      }))
      .filter(x => x.employee)
      .sort((a, b) => b.totalLate - a.totalLate)
      .slice(0, 10);
  }, [companyAttendance, companyEmployees]);

  // 4. Department Comparison
  const departmentData = useMemo(() => {
    const deptMap = new Map<string, { total: number; hadir: number; terlambat: number; overtimeMins: number; employees: Set<string> }>();
    for (const a of companyAttendance) {
      const emp = companyEmployees.find(e => e.id === a.employee_id);
      if (!emp || !emp.department) continue;
      const dept = emp.department;
      if (!deptMap.has(dept)) deptMap.set(dept, { total: 0, hadir: 0, terlambat: 0, overtimeMins: 0, employees: new Set() });
      const entry = deptMap.get(dept)!;
      entry.total++;
      entry.employees.add(a.employee_id);
      if (a.status === 'HADIR') entry.hadir++;
      else if (a.status === 'TERLAMBAT') entry.terlambat++;
      entry.overtimeMins += (a.overtime_minutes || 0);
    }
    return [...deptMap.entries()].map(([name, d]) => ({
      name,
      employeeCount: d.employees.size,
      attendancePct: d.total > 0 ? Math.round((d.hadir / d.total) * 100) : 0,
      latePct: d.total > 0 ? Math.round((d.terlambat / d.total) * 100) : 0,
      avgOvertimeHours: d.employees.size > 0 ? Math.round((d.overtimeMins / d.employees.size / 60) * 10) / 10 : 0,
    }));
  }, [companyAttendance, companyEmployees]);

  // 5. Attendance Consistency
  const consistencyData = useMemo(() => {
    return companyEmployees.map(emp => {
      const empAttendance = companyAttendance.filter(a => a.employee_id === emp.id);
      const total = empAttendance.length;
      const hadir = empAttendance.filter(a => ['HADIR', 'TERLAMBAT'].includes(a.status)).length;
      const rate = total > 0 ? Math.round((hadir / total) * 100) : 0;
      return { name: emp.full_name, rate, id: emp.id };
    }).sort((a, b) => b.rate - a.rate);
  }, [companyAttendance, companyEmployees]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Performa Tim</h1>
        <p className="text-muted-foreground">Analitik kehadiran {activeCompany?.name}</p>
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

      {/* A.1 Monthly Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Tren Kehadiran (8 Minggu Terakhir)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <YAxis unit="%" tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="hadirPct" name="Hadir" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="terlambatPct" name="Terlambat" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="tidakHadirPct" name="Tidak Hadir" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* A.2 Overtime Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Timer className="w-4 h-4" />
              Lembur Bulan Ini ({getMonthName(currentMonth)})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{overtimeData.totalOvertimeHours} <span className="text-sm font-normal text-muted-foreground">jam</span></div>
            <p className="text-sm text-muted-foreground mb-4">Total jam lembur seluruh karyawan</p>
            {overtimeData.top3.length > 0 && (
              <>
                <p className="text-sm font-medium mb-2">Top 3 Karyawan:</p>
                <div className="space-y-2">
                  {overtimeData.top3.map((item, i) => (
                    <div key={item.employee!.id} className="flex items-center gap-2 text-sm">
                      <span className="w-5 text-muted-foreground font-medium">#{i + 1}</span>
                      <span className="flex-1 truncate">{item.employee!.full_name}</span>
                      <Badge variant="secondary">{item.hours} jam</Badge>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* A.3 Late Frequency Leaderboard */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="w-4 h-4" />
              Peringkat Keterlambatan (Top 10)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 pr-2">#</th>
                    <th className="text-left py-2 pr-2">Nama</th>
                    <th className="text-right py-2 pr-2">Total Terlambat</th>
                    <th className="text-right py-2">Rata-rata (menit)</th>
                  </tr>
                </thead>
                <tbody>
                  {lateLeaderboard.map((item, i) => (
                    <tr key={item.employee!.id} className="border-b last:border-0">
                      <td className="py-2 pr-2 text-muted-foreground">{i + 1}</td>
                      <td className="py-2 pr-2 font-medium">{item.employee!.full_name}</td>
                      <td className="py-2 pr-2 text-right">
                        <Badge variant={i === 0 ? 'destructive' : 'secondary'}>{item.totalLate}x</Badge>
                      </td>
                      <td className="py-2 text-right">{item.avgLateMinutes} mnt</td>
                    </tr>
                  ))}
                  {lateLeaderboard.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-muted-foreground">Tidak ada data keterlambatan</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* A.4 Department Comparison */}
      {departmentData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Perbandingan Departemen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {departmentData.map(dept => (
                <Card key={dept.name} className="border border-border/50">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm">{dept.name}</p>
                      <Badge variant="outline">{dept.employeeCount} org</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <p className="text-emerald-600 font-bold text-sm">{dept.attendancePct}%</p>
                        <p className="text-muted-foreground">Hadir</p>
                      </div>
                      <div>
                        <p className="text-amber-600 font-bold text-sm">{dept.latePct}%</p>
                        <p className="text-muted-foreground">Telat</p>
                      </div>
                      <div>
                        <p className="text-blue-600 font-bold text-sm">{dept.avgOvertimeHours}</p>
                        <p className="text-muted-foreground">Lembur (jam)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* A.5 Attendance Consistency */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="w-4 h-4" />
            Konsistensi Kehadiran Karyawan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {consistencyData.slice(0, 15).map(emp => (
              <div key={emp.id} className="flex items-center gap-3">
                <span className="text-sm font-medium w-40 truncate">{emp.name}</span>
                <div className="flex-1 h-5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      emp.rate >= 80 ? 'bg-emerald-500' : emp.rate >= 50 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${emp.rate}%` }}
                  />
                </div>
                <span className="text-sm font-mono w-10 text-right">{emp.rate}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Bar Chart (existing) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Kehadiran Minggu Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))',
                }}
              />
              <Legend />
              <Bar dataKey="hadir" name="Hadir" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="terlambat" name="Terlambat" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Employee Ranking (existing) */}
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
