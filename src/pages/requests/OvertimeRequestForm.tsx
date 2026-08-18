import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/common/PageHeader';
import { generateId } from '@/lib/attendance';
import { Clock, Check } from 'lucide-react';
import type { OvertimeRequest } from '@/types';

export default function OvertimeRequestForm() {
  const { currentUser, activeCompany } = useAuthStore();
  const { addOvertimeRequest } = useAttendanceStore();
  const navigate = useNavigate();

  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('17:00');
  const [endTime, setEndTime] = useState('20:00');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!currentUser || !activeCompany) return null;

  const durationHours = (() => {
    if (!startTime || !endTime) return 0;
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const diff = (eh * 60 + em) - (sh * 60 + sm);
    return Math.max(0, Math.round((diff / 60) * 10) / 10);
  })();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const request: OvertimeRequest = {
      id: generateId('ot'),
      company_id: activeCompany.id,
      employee_id: currentUser.id,
      employee_name: currentUser.full_name,
      date,
      start_time: startTime,
      end_time: endTime,
      duration_hours: durationHours,
      reason,
      status: 'PENDING',
      approved_by: null,
      created_at: new Date().toISOString(),
    };

    addOvertimeRequest(request);
    // Notify admin via Telegram
    fetch('/api/telegram/notify-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'overtime', employee_name: currentUser?.full_name || '', details: `${request.start_time} - ${request.end_time} (${request.duration_hours} jam)`, date: request.date, reason: request.reason }),
    }).catch(() => {});
    setSubmitted(true);
    setTimeout(() => navigate('/my-requests'), 2000);
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold">Pengajuan Lembur Terkirim! ✅</h2>
          <p className="text-muted-foreground">Menunggu persetujuan atasan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <PageHeader title="Ajukan Lembur" subtitle="Isi form pengajuan lembur" backTo="/my-requests" />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock size={18} /> Form Pengajuan Lembur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal Lembur</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>

            {/* Time range */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Jam Mulai</label>
                <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Jam Selesai</label>
                <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
              </div>
            </div>

            {/* Duration display */}
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
              <p className="text-sm font-medium">Durasi: {durationHours} jam</p>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Alasan / Deskripsi Tugas</label>
              <textarea
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Jelaskan tugas yang akan dikerjakan saat lembur..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            {/* Submit */}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => navigate('/my-requests')} className="flex-1">
                Batal
              </Button>
              <Button type="submit" className="flex-1" disabled={!date || !reason || durationHours <= 0}>
                <Clock size={16} className="mr-1" /> Kirim Pengajuan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}