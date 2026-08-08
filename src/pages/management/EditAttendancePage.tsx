import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { useDataStore } from '@/stores/dataStore';
import type { WorkSchedule } from '@/stores/dataStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  generateId,
  getTodayStr,
  parseDateStr,
  resolveSchedule,
  calculateLateMinutes,
  calculateEarlyLeaveMinutes,
  calculateOvertimeMinutes,
  formatDateLong,
  isoToTimeInput,
  timeInputToIso,
  ATTENDANCE_STATUS_OPTIONS,
} from '@/lib/attendance';
import { getStatusLabel } from '@/lib/utils';
import type { AttendanceStatus } from '@/types';
import { UserCog, Save, History } from 'lucide-react';

export default function EditAttendancePage() {
  const { currentUser, activeCompany } = useAuthStore();
  const { attendances, addAttendance, updateAttendance } = useAttendanceStore();
  const { employees, workSchedules, overtimeSettings } = useDataStore();

  const companyId = activeCompany?.id || currentUser?.company_id || '';

  const [employeeId, setEmployeeId] = useState('');
  const [date, setDate] = useState(getTodayStr());
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');
  const [status, setStatus] = useState<AttendanceStatus>('HADIR');
  const [notes, setNotes] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

  const companyEmployees = useMemo(
    () => employees.filter((e) => e.company_id === companyId && e.is_active).sort((a, b) => a.full_name.localeCompare(b.full_name)),
    [employees, companyId]
  );

  const selectedEmployee = companyEmployees.find((e) => e.id === employeeId) || null;

  const existingRecord = useMemo(
    () => attendances.find((a) => a.employee_id === employeeId && a.company_id === companyId && a.date === date),
    [attendances, employeeId, companyId, date]
  );

  // Load existing record into the form whenever employee/date changes
  useEffect(() => {
    setSavedMessage('');
    if (existingRecord) {
      setCheckInTime(isoToTimeInput(existingRecord.check_in_time));
      setCheckOutTime(isoToTimeInput(existingRecord.check_out_time));
      setStatus(existingRecord.status);
      setNotes(existingRecord.notes || '');
    } else {
      setCheckInTime('');
      setCheckOutTime('');
      setStatus('HADIR');
      setNotes('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, date]);

  const recentHistory = useMemo(() => {
    if (!employeeId) return [];
    return attendances
      .filter((a) => a.employee_id === employeeId && a.company_id === companyId)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 7);
  }, [attendances, employeeId, companyId]);

  const handleSave = () => {
    if (!employeeId || !date || !selectedEmployee) return;

    const checkInIso = timeInputToIso(date, checkInTime);
    const checkOutIso = timeInputToIso(date, checkOutTime);
    const schedule = resolveSchedule(selectedEmployee, parseDateStr(date), workSchedules as WorkSchedule[]);

    const lateMinutes = checkInIso ? calculateLateMinutes(checkInIso, schedule.start) : 0;
    const earlyLeaveMinutes = checkOutIso ? calculateEarlyLeaveMinutes(checkOutIso, schedule.end) : 0;
    const overtimeMinutes = checkOutIso ? calculateOvertimeMinutes(checkOutIso, schedule.end, overtimeSettings) : 0;

    const auditLine = `Diedit manual oleh ${currentUser?.full_name || 'admin'} pada ${new Date().toLocaleString('id-ID')}`;
    const combinedNotes = notes.trim() ? `${notes.trim()}\n${auditLine}` : auditLine;

    if (existingRecord) {
      updateAttendance(existingRecord.id, {
        check_in_time: checkInIso,
        check_out_time: checkOutIso,
        status,
        check_in_method: existingRecord.check_in_method || 'MANUAL',
        notes: combinedNotes,
        late_minutes: lateMinutes,
        early_leave_minutes: earlyLeaveMinutes,
        overtime_minutes: overtimeMinutes,
      });
    } else {
      addAttendance({
        id: generateId('att'),
        company_id: companyId,
        employee_id: employeeId,
        date,
        check_in_time: checkInIso,
        check_out_time: checkOutIso,
        status,
        check_in_method: 'MANUAL',
        check_in_location: null,
        check_out_location: null,
        check_in_photo_url: '',
        notes: combinedNotes,
        is_auto_checkout: false,
        overtime_minutes: overtimeMinutes,
        late_minutes: lateMinutes,
        early_leave_minutes: earlyLeaveMinutes,
      });
    }

    setNotes(combinedNotes);
    setSavedMessage('Absensi berhasil disimpan.');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UserCog className="w-6 h-6 text-primary" />
          Edit Absensi Karyawan
        </h1>
        <p className="text-muted-foreground">
          Ubah atau isi langsung data absensi karyawan Anda untuk tanggal tertentu — tanpa perlu karyawan mengajukan koreksi lebih dulu.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pilih Karyawan & Tanggal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Karyawan</label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              >
                <option value="">Pilih karyawan...</option>
                {companyEmployees.map((e) => (
                  <option key={e.id} value={e.id}>{e.full_name} — {e.position}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Tanggal</label>
              <input
                type="date"
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {employeeId && (
            <p className="text-xs text-muted-foreground">
              {existingRecord
                ? `Sudah ada data absensi untuk ${formatDateLong(date)} — mengedit data yang ada.`
                : `Belum ada data absensi untuk ${formatDateLong(date)} — akan dibuat baru.`}
            </p>
          )}
        </CardContent>
      </Card>

      {employeeId && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Data Absensi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Jam Masuk</label>
                <input
                  type="time"
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Jam Pulang</label>
                <input
                  type="time"
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Status</label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                value={status}
                onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
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
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Alasan koreksi, dsb."
              />
            </div>

            <Button onClick={handleSave} className="w-full gap-2">
              <Save className="w-4 h-4" />
              Simpan Absensi
            </Button>

            {savedMessage && (
              <p className="text-sm text-emerald-600 text-center">{savedMessage}</p>
            )}
          </CardContent>
        </Card>
      )}

      {employeeId && recentHistory.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <History className="w-4 h-4" />
              Riwayat Terakhir — {selectedEmployee?.full_name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-3 text-left font-medium">Tanggal</th>
                    <th className="p-3 text-center font-medium">Masuk</th>
                    <th className="p-3 text-center font-medium">Pulang</th>
                    <th className="p-3 text-center font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentHistory.map((a) => (
                    <tr key={a.id} className="hover:bg-muted/30">
                      <td className="p-3 text-xs">{a.date}</td>
                      <td className="p-3 text-center text-xs font-mono">{isoToTimeInput(a.check_in_time) || '-'}</td>
                      <td className="p-3 text-center text-xs font-mono">{isoToTimeInput(a.check_out_time) || '-'}</td>
                      <td className="p-3 text-center">
                        <StatusBadge status={a.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
