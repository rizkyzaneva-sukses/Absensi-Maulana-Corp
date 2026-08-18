import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/common/PageHeader';
import { useAuthStore } from '@/stores/authStore';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { generateId, getTodayStr } from '@/lib/attendance';
import { AlertCircle, Clock, Calendar } from 'lucide-react';

export default function CorrectionRequestForm() {
  const navigate = useNavigate();
  const { currentUser, activeCompany } = useAuthStore();
  const { attendances, addCorrection } = useAttendanceStore();

  const [selectedDate, setSelectedDate] = useState('');
  const [correctedCheckIn, setCorrectedCheckIn] = useState('');
  const [correctedCheckOut, setCorrectedCheckOut] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const companyId = activeCompany?.id || currentUser?.company_id || '';
  const employeeId = currentUser?.id || '';

  // Get attendance records for this employee
  const myAttendances = attendances.filter(
    (a) => a.employee_id === employeeId && a.company_id === companyId
  );

  // Find the attendance record for selected date
  const selectedAttendance = myAttendances.find((a) => a.date === selectedDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !correctedCheckIn || !correctedCheckOut || !reason.trim()) return;
    if (!selectedAttendance) return;

    setSubmitting(true);

    const correction = {
      id: generateId('CORR'),
      company_id: companyId,
      employee_id: employeeId,
      employee_name: currentUser?.full_name || '',
      attendance_id: selectedAttendance.id,
      date: selectedDate,
      original_check_in: selectedAttendance.check_in_time,
      original_check_out: selectedAttendance.check_out_time,
      corrected_check_in: `${selectedDate}T${correctedCheckIn}:00`,
      corrected_check_out: `${selectedDate}T${correctedCheckOut}:00`,
      reason: reason.trim(),
      status: 'PENDING' as const,
      approved_by: null,
      created_at: new Date().toISOString(),
    };

    addCorrection(correction);
    // Notify admin via Telegram
    fetch('/api/telegram/notify-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'correction', employee_name: currentUser?.full_name || '', details: `Check-in: ${correction.corrected_check_in} → Check-out: ${correction.corrected_check_out}`, date: correction.date, reason: correction.reason }),
    }).catch(() => {});

    setTimeout(() => {
      setSubmitting(false);
      navigate('/my-requests');
    }, 500);
  };

  const formatTime = (t: string | null | undefined) => {
    if (!t) return '-';
    if (t.includes('T')) return new Date(t).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    return t; // already "HH:mm"
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Koreksi Absensi"
        subtitle="Ajukan koreksi waktu check-in/check-out"
        backTo="/my-requests"
      />

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        {/* Date Selection */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Pilih Tanggal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={getTodayStr()}
              required
            />

            {selectedDate && !selectedAttendance && (
              <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>Tidak ada data absensi untuk tanggal ini</span>
              </div>
            )}

            {selectedAttendance && (
              <div className="bg-muted/50 p-3 rounded-lg space-y-1">
                <p className="text-sm font-medium">Data Asli:</p>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <span>Check-in: {formatTime(selectedAttendance.check_in_time)}</span>
                  <span>Check-out: {formatTime(selectedAttendance.check_out_time)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Status: {selectedAttendance.status}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Corrected Times */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Waktu Koreksi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Check-in yang benar</label>
              <Input
                type="time"
                value={correctedCheckIn}
                onChange={(e) => setCorrectedCheckIn(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Check-out yang benar</label>
              <Input
                type="time"
                value={correctedCheckOut}
                onChange={(e) => setCorrectedCheckOut(e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Reason */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Alasan Koreksi</label>
              <textarea
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Jelaskan alasan koreksi absensi..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/my-requests')}
            className="flex-1"
          >
            Batal
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={submitting || !selectedAttendance || !correctedCheckIn || !correctedCheckOut || !reason.trim()}
          >
            {submitting ? 'Mengirim...' : 'Ajukan Koreksi'}
          </Button>
        </div>
      </form>
    </div>
  );
}