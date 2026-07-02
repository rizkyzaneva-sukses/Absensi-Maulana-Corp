import { useState, useMemo } from 'react';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { useDataStore } from '@/stores/dataStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { companies } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import { getDateStr, getTodayStr } from '@/lib/attendance';
import { History, Filter, Download, Users, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function OwnerAttendancePage() {
  const { attendances } = useAttendanceStore();
  const { employees } = useDataStore();

  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(20);

  const todayStr = getTodayStr();

  const formatTime = (t: string | null | undefined) => {
    if (!t) return '-';
    if (t.includes('T')) return new Date(t).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    return t;
  };

  // Filtered data
  const filtered = useMemo(() => {
    return attendances
      .filter(a => {
        if (selectedCompany !== 'all' && a.company_id !== selectedCompany) return false;
        if (selectedDate && a.date !== selectedDate) return false;
        if (selectedStatus !== 'all' && a.status !== selectedStatus) return false;
        if (selectedEmployee !== 'all' && a.employee_id !== selectedEmployee) return false;
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [attendances, selectedCompany, selectedDate, selectedStatus, selectedEmployee]);

  // Summary stats
  const summary = useMemo(() => {
    const base = selectedCompany === 'all'
      ? attendances.filter(a => !selectedDate || a.date === selectedDate)
      : attendances.filter(a => a.company_id === selectedCompany && (!selectedDate || a.date === selectedDate));

    return {
      total: base.length,
      hadir: base.filter(a => a.status === 'HADIR').length,
      terlambat: base.filter(a => a.status === 'TERLAMBAT').length,
      tidakHadir: base.filter(a => a.status === 'TIDAK_HADIR').length,
    };
  }, [attendances, selectedCompany, selectedDate]);

  // Employees for filter dropdown
  const filterableEmployees = useMemo(() => {
    return employees.filter(e =>
      selectedCompany === 'all' || e.company_id === selectedCompany
    );
  }, [employees, selectedCompany]);

  // Export to CSV
  const handleExport = () => {
    const rows = [
      ['Tanggal', 'Perusahaan', 'Karyawan', 'Jabatan', 'Check-in', 'Check-out', 'Status', 'Terlambat (menit)'],
      ...filtered.map(a => {
        const emp = employees.find(e => e.id === a.employee_id);
        const company = companies.find(c => c.id === a.company_id);
        return [
          a.date,
          company?.name || a.company_id,
          emp?.full_name || a.employee_id,
          emp?.position || '-',
          formatTime(a.check_in_time),
          formatTime(a.check_out_time),
          a.status,
          a.late_minutes?.toString() || '0',
        ];
      }),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `absensi-${selectedCompany}-${selectedDate || 'semua'}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <History className="w-6 h-6 text-primary" />
            Riwayat Absensi Semua Karyawan
          </h1>
          <p className="text-muted-foreground">Pantau kehadiran seluruh karyawan di semua perusahaan</p>
        </div>
        <Button variant="outline" onClick={handleExport} className="gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Record</p>
              <p className="text-xl font-bold">{summary.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tepat Waktu</p>
              <p className="text-xl font-bold">{summary.hadir}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Terlambat</p>
              <p className="text-xl font-bold">{summary.terlambat}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tidak Hadir</p>
              <p className="text-xl font-bold">{summary.tidakHadir}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Company filter */}
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Perusahaan</label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                value={selectedCompany}
                onChange={e => { setSelectedCompany(e.target.value); setSelectedEmployee('all'); }}
              >
                <option value="all">Semua Perusahaan</option>
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Date filter */}
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Tanggal</label>
              <input
                type="date"
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
              />
            </div>

            {/* Status filter */}
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Status</label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
              >
                <option value="all">Semua Status</option>
                <option value="HADIR">Hadir</option>
                <option value="TERLAMBAT">Terlambat</option>
                <option value="TIDAK_HADIR">Tidak Hadir</option>
                <option value="IZIN">Izin</option>
                <option value="SAKIT">Sakit</option>
                <option value="CUTI">Cuti</option>
              </select>
            </div>

            {/* Employee filter */}
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Karyawan</label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                value={selectedEmployee}
                onChange={e => setSelectedEmployee(e.target.value)}
              >
                <option value="all">Semua Karyawan</option>
                {filterableEmployees.filter(e => e.is_active).map(e => (
                  <option key={e.id} value={e.id}>{e.full_name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick date buttons */}
          <div className="flex gap-2 mt-3 flex-wrap">
            <Button size="sm" variant={selectedDate === todayStr ? 'default' : 'outline'} onClick={() => setSelectedDate(todayStr)}>
              Hari Ini
            </Button>
            <Button size="sm" variant="outline" onClick={() => {
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              setSelectedDate(getDateStr(yesterday));
            }}>
              Kemarin
            </Button>
            <Button size="sm" variant="outline" onClick={() => setSelectedDate('')}>
              Semua Tanggal
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              Data Absensi
            </CardTitle>
            <span className="text-xs text-muted-foreground">{filtered.length} record ditemukan</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="p-3 text-left font-medium">Tanggal</th>
                  <th className="p-3 text-left font-medium">Perusahaan</th>
                  <th className="p-3 text-left font-medium">Karyawan</th>
                  <th className="p-3 text-center font-medium">Check-in</th>
                  <th className="p-3 text-center font-medium">Check-out</th>
                  <th className="p-3 text-center font-medium">Terlambat</th>
                  <th className="p-3 text-center font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-10 text-center text-muted-foreground">
                      <History className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p>Tidak ada data absensi ditemukan</p>
                    </td>
                  </tr>
                ) : (
                  filtered.slice(0, visibleCount).map(att => {
                    const emp = employees.find(e => e.id === att.employee_id);
                    const company = companies.find(c => c.id === att.company_id);
                    return (
                      <tr key={att.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-3 text-xs font-medium">{formatDate(att.date)}</td>
                        <td className="p-3">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                            {company?.name || att.company_id}
                          </span>
                        </td>
                        <td className="p-3">
                          <p className="font-medium text-sm">{emp?.full_name || '-'}</p>
                          <p className="text-xs text-muted-foreground">{emp?.position || '-'}</p>
                        </td>
                        <td className="p-3 text-center text-xs font-mono">{formatTime(att.check_in_time)}</td>
                        <td className="p-3 text-center text-xs font-mono">{formatTime(att.check_out_time)}</td>
                        <td className="p-3 text-center">
                          {att.late_minutes > 0 ? (
                            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                              +{att.late_minutes} mnt
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <StatusBadge status={att.status} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Load more */}
          {visibleCount < filtered.length && (
            <div className="p-4 flex justify-center border-t">
              <Button variant="outline" size="sm" onClick={() => setVisibleCount(v => v + 20)}>
                Tampilkan Lebih Banyak ({filtered.length - visibleCount} tersisa)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
