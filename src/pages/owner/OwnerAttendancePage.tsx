import { useState, useMemo, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { useDataStore } from '@/stores/dataStore';
import type { WorkSchedule } from '@/stores/dataStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { companies } from '@/lib/mock-data';
import { formatDate, getStatusLabel, cn } from '@/lib/utils';
import {
  generateId,
  getDateStr,
  getTodayStr,
  parseDateStr,
  resolveSchedule,
  calculateLateMinutes,
  calculateEarlyLeaveMinutes,
  calculateOvertimeMinutes,
  isoToTimeInput,
  timeInputToIso,
  enumerateDateRange,
  ATTENDANCE_STATUS_OPTIONS,
} from '@/lib/attendance';
import type { Attendance, AttendanceStatus } from '@/types';
import { History, Filter, Download, Users, CheckCircle, Clock, AlertTriangle, Pencil, X, PlusCircle } from 'lucide-react';

const FALLBACK_SCHEDULE = { start: '08:00', end: '17:00', is_workday: true };

export default function OwnerAttendancePage() {
  const { currentUser } = useAuthStore();
  const { attendances, addAttendance, updateAttendance } = useAttendanceStore();
  const { employees, workSchedules, overtimeSettings } = useDataStore();

  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(20);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Single-record edit dialog
  const [editingRecord, setEditingRecord] = useState<Attendance | null>(null);
  const [editCheckIn, setEditCheckIn] = useState('');
  const [editCheckOut, setEditCheckOut] = useState('');
  const [editStatus, setEditStatus] = useState<AttendanceStatus>('HADIR');
  const [editNotes, setEditNotes] = useState('');

  // Bulk edit dialog
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkCheckInOn, setBulkCheckInOn] = useState(false);
  const [bulkCheckIn, setBulkCheckIn] = useState('');
  const [bulkCheckOutOn, setBulkCheckOutOn] = useState(false);
  const [bulkCheckOut, setBulkCheckOut] = useState('');
  const [bulkStatusOn, setBulkStatusOn] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<AttendanceStatus>('HADIR');
  const [bulkNotes, setBulkNotes] = useState('');
  const [confirmBulkOpen, setConfirmBulkOpen] = useState(false);

  // Fill-missing-dates dialog (for employees who have no record at all on some dates)
  const [fillOpen, setFillOpen] = useState(false);
  const [fillEmployeeId, setFillEmployeeId] = useState('');
  const [fillStartDate, setFillStartDate] = useState('');
  const [fillEndDate, setFillEndDate] = useState('');
  const [fillCheckIn, setFillCheckIn] = useState('');
  const [fillCheckOut, setFillCheckOut] = useState('');
  const [fillStatus, setFillStatus] = useState<AttendanceStatus>('HADIR');
  const [fillNotes, setFillNotes] = useState('');
  const [confirmFillOpen, setConfirmFillOpen] = useState(false);

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

  // Selection should not survive across a filter change — the rows it pointed at may no
  // longer be visible, and silently editing hidden rows later would be confusing.
  useEffect(() => {
    setSelectedIds(new Set());
  }, [selectedCompany, selectedDate, selectedStatus, selectedEmployee]);

  const visibleRows = filtered.slice(0, visibleCount);
  const allVisibleSelected = visibleRows.length > 0 && visibleRows.every((a) => selectedIds.has(a.id));
  const selectedRecords = useMemo(
    () => filtered.filter((a) => selectedIds.has(a.id)),
    [filtered, selectedIds]
  );

  function toggleSelectAllVisible() {
    setSelectedIds((prev) => {
      if (allVisibleSelected) {
        const next = new Set(prev);
        visibleRows.forEach((a) => next.delete(a.id));
        return next;
      }
      const next = new Set(prev);
      visibleRows.forEach((a) => next.add(a.id));
      return next;
    });
  }

  function toggleSelectOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function scheduleFor(employeeId: string, date: string) {
    const emp = employees.find((e) => e.id === employeeId);
    return emp ? resolveSchedule(emp, parseDateStr(date), workSchedules as WorkSchedule[]) : FALLBACK_SCHEDULE;
  }

  function openEditDialog(record: Attendance) {
    setEditingRecord(record);
    setEditCheckIn(isoToTimeInput(record.check_in_time));
    setEditCheckOut(isoToTimeInput(record.check_out_time));
    setEditStatus(record.status);
    setEditNotes(record.notes || '');
  }

  function saveEditDialog() {
    if (!editingRecord) return;
    const schedule = scheduleFor(editingRecord.employee_id, editingRecord.date);
    const checkInIso = timeInputToIso(editingRecord.date, editCheckIn);
    const checkOutIso = timeInputToIso(editingRecord.date, editCheckOut);
    const lateMinutes = checkInIso ? calculateLateMinutes(checkInIso, schedule.start) : 0;
    const earlyLeaveMinutes = checkOutIso ? calculateEarlyLeaveMinutes(checkOutIso, schedule.end) : 0;
    const overtimeMinutes = checkOutIso ? calculateOvertimeMinutes(checkOutIso, schedule.end, overtimeSettings) : 0;

    const auditLine = `Diedit manual oleh ${currentUser?.full_name || 'admin'} pada ${new Date().toLocaleString('id-ID')}`;
    const combinedNotes = editNotes.trim() ? `${editNotes.trim()}\n${auditLine}` : auditLine;

    updateAttendance(editingRecord.id, {
      check_in_time: checkInIso,
      check_out_time: checkOutIso,
      status: editStatus,
      notes: combinedNotes,
      late_minutes: lateMinutes,
      early_leave_minutes: earlyLeaveMinutes,
      overtime_minutes: overtimeMinutes,
    });
    setEditingRecord(null);
  }

  const bulkChangeSummary = [
    bulkCheckInOn && `Jam Masuk → ${bulkCheckIn || '(kosong)'}`,
    bulkCheckOutOn && `Jam Pulang → ${bulkCheckOut || '(kosong)'}`,
    bulkStatusOn && `Status → ${getStatusLabel(bulkStatus)}`,
  ].filter(Boolean).join(', ');

  function applyBulkEdit() {
    const auditLine = `Diedit massal oleh ${currentUser?.full_name || 'admin'} pada ${new Date().toLocaleString('id-ID')}`;
    const noteAddition = bulkNotes.trim() ? `${bulkNotes.trim()}\n${auditLine}` : auditLine;

    for (const record of selectedRecords) {
      const schedule = scheduleFor(record.employee_id, record.date);
      const checkInIso = bulkCheckInOn ? timeInputToIso(record.date, bulkCheckIn) : record.check_in_time;
      const checkOutIso = bulkCheckOutOn ? timeInputToIso(record.date, bulkCheckOut) : record.check_out_time;
      const status = bulkStatusOn ? bulkStatus : record.status;

      const lateMinutes = checkInIso ? calculateLateMinutes(checkInIso, schedule.start) : 0;
      const earlyLeaveMinutes = checkOutIso ? calculateEarlyLeaveMinutes(checkOutIso, schedule.end) : 0;
      const overtimeMinutes = checkOutIso ? calculateOvertimeMinutes(checkOutIso, schedule.end, overtimeSettings) : 0;
      const combinedNotes = record.notes ? `${record.notes}\n${noteAddition}` : noteAddition;

      updateAttendance(record.id, {
        check_in_time: checkInIso,
        check_out_time: checkOutIso,
        status,
        notes: combinedNotes,
        late_minutes: lateMinutes,
        early_leave_minutes: earlyLeaveMinutes,
        overtime_minutes: overtimeMinutes,
      });
    }

    setConfirmBulkOpen(false);
    setBulkOpen(false);
    setSelectedIds(new Set());
    setBulkCheckInOn(false);
    setBulkCheckOutOn(false);
    setBulkStatusOn(false);
    setBulkNotes('');
  }

  const fillEmployee = employees.find((e) => e.id === fillEmployeeId) || null;

  const missingDates = useMemo(() => {
    if (!fillEmployee || !fillStartDate || !fillEndDate || fillStartDate > fillEndDate) return [];
    return enumerateDateRange(fillStartDate, fillEndDate).filter(
      (date) => !attendances.some(
        (a) => a.employee_id === fillEmployee.id && a.company_id === fillEmployee.company_id && a.date === date
      )
    );
  }, [fillEmployee, fillStartDate, fillEndDate, attendances]);

  function applyFill() {
    if (!fillEmployee) return;
    const auditLine = `Dibuat manual oleh ${currentUser?.full_name || 'admin'} pada ${new Date().toLocaleString('id-ID')}`;
    const notes = fillNotes.trim() ? `${fillNotes.trim()}\n${auditLine}` : auditLine;

    for (const date of missingDates) {
      const schedule = scheduleFor(fillEmployee.id, date);
      const checkInIso = timeInputToIso(date, fillCheckIn);
      const checkOutIso = timeInputToIso(date, fillCheckOut);
      const lateMinutes = checkInIso ? calculateLateMinutes(checkInIso, schedule.start) : 0;
      const earlyLeaveMinutes = checkOutIso ? calculateEarlyLeaveMinutes(checkOutIso, schedule.end) : 0;
      const overtimeMinutes = checkOutIso ? calculateOvertimeMinutes(checkOutIso, schedule.end, overtimeSettings) : 0;

      addAttendance({
        id: generateId('att'),
        company_id: fillEmployee.company_id,
        employee_id: fillEmployee.id,
        date,
        check_in_time: checkInIso,
        check_out_time: checkOutIso,
        status: fillStatus,
        check_in_method: 'MANUAL',
        check_in_location: null,
        check_out_location: null,
        check_in_photo_url: '',
        notes,
        is_auto_checkout: false,
        overtime_minutes: overtimeMinutes,
        late_minutes: lateMinutes,
        early_leave_minutes: earlyLeaveMinutes,
      });
    }

    setConfirmFillOpen(false);
    setFillOpen(false);
    setFillEmployeeId('');
    setFillStartDate('');
    setFillEndDate('');
    setFillCheckIn('');
    setFillCheckOut('');
    setFillNotes('');
  }

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
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setFillOpen(true)} className="gap-2">
            <PlusCircle className="w-4 h-4" />
            Isi Tanggal Kosong
          </Button>
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
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
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base">
              Data Absensi
            </CardTitle>
            {selectedIds.size > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{selectedIds.size} dipilih</span>
                <Button size="sm" variant="outline" onClick={() => setSelectedIds(new Set())} className="gap-1">
                  <X className="w-3 h-3" /> Batal Pilih
                </Button>
                <Button size="sm" onClick={() => setBulkOpen(true)} className="gap-1">
                  <Pencil className="w-3 h-3" /> Edit {selectedIds.size} Terpilih
                </Button>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">{filtered.length} record ditemukan</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  <th className="p-3 text-center font-medium w-10">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAllVisible}
                      aria-label="Pilih semua yang ditampilkan"
                    />
                  </th>
                  <th className="p-3 text-left font-medium">Tanggal</th>
                  <th className="p-3 text-left font-medium">Perusahaan</th>
                  <th className="p-3 text-left font-medium">Karyawan</th>
                  <th className="p-3 text-center font-medium">Check-in</th>
                  <th className="p-3 text-center font-medium">Check-out</th>
                  <th className="p-3 text-center font-medium">Terlambat</th>
                  <th className="p-3 text-center font-medium">Status</th>
                  <th className="p-3 text-center font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-10 text-center text-muted-foreground">
                      <History className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p>Tidak ada data absensi ditemukan</p>
                    </td>
                  </tr>
                ) : (
                  visibleRows.map(att => {
                    const emp = employees.find(e => e.id === att.employee_id);
                    const company = companies.find(c => c.id === att.company_id);
                    return (
                      <tr key={att.id} className={cn('hover:bg-muted/30 transition-colors', selectedIds.has(att.id) && 'bg-primary/5')}>
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(att.id)}
                            onChange={() => toggleSelectOne(att.id)}
                            aria-label={`Pilih record ${emp?.full_name || att.employee_id}`}
                          />
                        </td>
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
                        <td className="p-3 text-center">
                          <Button size="sm" variant="ghost" onClick={() => openEditDialog(att)} className="h-7 w-7 p-0">
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
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

      {/* Single-record edit dialog */}
      <Dialog open={!!editingRecord} onOpenChange={(open) => !open && setEditingRecord(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Edit Absensi — {employees.find(e => e.id === editingRecord?.employee_id)?.full_name || '-'}
            </DialogTitle>
          </DialogHeader>
          {editingRecord && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">{formatDate(editingRecord.date)}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Jam Masuk</label>
                  <input
                    type="time"
                    className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                    value={editCheckIn}
                    onChange={(e) => setEditCheckIn(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Jam Pulang</label>
                  <input
                    type="time"
                    className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                    value={editCheckOut}
                    onChange={(e) => setEditCheckOut(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Status</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as AttendanceStatus)}
                >
                  {ATTENDANCE_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{getStatusLabel(s)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Catatan (opsional)</label>
                <textarea
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRecord(null)}>Batal</Button>
            <Button onClick={saveEditDialog}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk edit dialog */}
      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {selectedRecords.length} Record Sekaligus</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Aktifkan field yang mau diubah. Field yang tidak diaktifkan tidak akan disentuh pada record-record terpilih.
            </p>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="bulk-checkin-on" checked={bulkCheckInOn} onChange={(e) => setBulkCheckInOn(e.target.checked)} />
              <label htmlFor="bulk-checkin-on" className="text-sm w-28">Jam Masuk</label>
              <input
                type="time"
                className="flex-1 border rounded-md px-3 py-2 text-sm bg-background disabled:opacity-50"
                value={bulkCheckIn}
                disabled={!bulkCheckInOn}
                onChange={(e) => setBulkCheckIn(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="bulk-checkout-on" checked={bulkCheckOutOn} onChange={(e) => setBulkCheckOutOn(e.target.checked)} />
              <label htmlFor="bulk-checkout-on" className="text-sm w-28">Jam Pulang</label>
              <input
                type="time"
                className="flex-1 border rounded-md px-3 py-2 text-sm bg-background disabled:opacity-50"
                value={bulkCheckOut}
                disabled={!bulkCheckOutOn}
                onChange={(e) => setBulkCheckOut(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="bulk-status-on" checked={bulkStatusOn} onChange={(e) => setBulkStatusOn(e.target.checked)} />
              <label htmlFor="bulk-status-on" className="text-sm w-28">Status</label>
              <select
                className="flex-1 border rounded-md px-3 py-2 text-sm bg-background disabled:opacity-50"
                value={bulkStatus}
                disabled={!bulkStatusOn}
                onChange={(e) => setBulkStatus(e.target.value as AttendanceStatus)}
              >
                {ATTENDANCE_STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{getStatusLabel(s)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Catatan (opsional, ditambahkan ke semua record terpilih)</label>
              <textarea
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                rows={2}
                value={bulkNotes}
                onChange={(e) => setBulkNotes(e.target.value)}
              />
            </div>

            <div className="text-xs text-muted-foreground bg-muted/50 rounded-md p-2">
              {selectedRecords.length} record dari karyawan:{' '}
              {[...new Set(selectedRecords.map(r => employees.find(e => e.id === r.employee_id)?.full_name || r.employee_id))].join(', ')}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkOpen(false)}>Batal</Button>
            <Button
              disabled={!bulkCheckInOn && !bulkCheckOutOn && !bulkStatusOn}
              onClick={() => setConfirmBulkOpen(true)}
            >
              Terapkan ke {selectedRecords.length} Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        open={confirmBulkOpen}
        onOpenChange={setConfirmBulkOpen}
        title="Terapkan perubahan massal?"
        description={`${selectedRecords.length} record akan diubah: ${bulkChangeSummary || '-'}. Perubahan ini langsung tersimpan dan tidak bisa di-undo otomatis.`}
        confirmLabel="Ya, Terapkan"
        variant="destructive"
        onConfirm={applyBulkEdit}
      />

      {/* Fill missing dates dialog — for an employee who has NO record at all on some dates
          (those dates never show up as rows in the table above, so there's nothing to check). */}
      <Dialog open={fillOpen} onOpenChange={setFillOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Isi Tanggal yang Belum Ada Record</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Untuk karyawan yang sebenarnya hadir tapi tanggalnya sama sekali tidak muncul di tabel (belum pernah tersimpan).
              Tanggal yang sudah punya record akan dilewati otomatis — tidak akan ditimpa di sini.
            </p>

            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Karyawan</label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                value={fillEmployeeId}
                onChange={(e) => setFillEmployeeId(e.target.value)}
              >
                <option value="">Pilih karyawan...</option>
                {employees.filter((e) => e.is_active).map((e) => (
                  <option key={e.id} value={e.id}>{e.full_name} — {companies.find(c => c.id === e.company_id)?.name || e.company_id}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Dari Tanggal</label>
                <input
                  type="date"
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  value={fillStartDate}
                  onChange={(e) => setFillStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Sampai Tanggal</label>
                <input
                  type="date"
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  value={fillEndDate}
                  onChange={(e) => setFillEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Jam Masuk</label>
                <input
                  type="time"
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  value={fillCheckIn}
                  onChange={(e) => setFillCheckIn(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Jam Pulang</label>
                <input
                  type="time"
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  value={fillCheckOut}
                  onChange={(e) => setFillCheckOut(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Status</label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                value={fillStatus}
                onChange={(e) => setFillStatus(e.target.value as AttendanceStatus)}
              >
                {ATTENDANCE_STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{getStatusLabel(s)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Catatan (opsional)</label>
              <textarea
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                rows={2}
                value={fillNotes}
                onChange={(e) => setFillNotes(e.target.value)}
              />
            </div>

            {fillEmployee && fillStartDate && fillEndDate && (
              <div className="text-xs bg-muted/50 rounded-md p-2">
                {missingDates.length === 0 ? (
                  <span className="text-muted-foreground">Semua tanggal di rentang ini sudah punya record — tidak ada yang perlu diisi.</span>
                ) : (
                  <>
                    <span className="text-muted-foreground">{missingDates.length} tanggal belum ada record, akan dibuat:</span>{' '}
                    <span className="font-medium">{missingDates.map(formatDate).join(', ')}</span>
                  </>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFillOpen(false)}>Batal</Button>
            <Button
              disabled={missingDates.length === 0}
              onClick={() => setConfirmFillOpen(true)}
            >
              Buat {missingDates.length} Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        open={confirmFillOpen}
        onOpenChange={setConfirmFillOpen}
        title="Buat record absensi baru?"
        description={`${missingDates.length} record baru akan dibuat untuk ${fillEmployee?.full_name || '-'} (${missingDates.map(formatDate).join(', ')}), dengan jam masuk ${fillCheckIn || '(kosong)'} dan jam pulang ${fillCheckOut || '(kosong)'}, status ${getStatusLabel(fillStatus)}.`}
        confirmLabel="Ya, Buat"
        onConfirm={applyFill}
      />
    </div>
  );
}
