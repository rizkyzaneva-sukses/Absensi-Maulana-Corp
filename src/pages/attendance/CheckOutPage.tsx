import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { useDataStore } from '@/stores/dataStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StepIndicator } from '@/components/common/StepIndicator';
import { SelfieCapture } from '@/components/attendance/SelfieCapture';
import { Check, Clock, Camera, AlertTriangle } from 'lucide-react';
import { calculateEarlyLeaveMinutes, calculateOvertimeMinutes, determineCheckOutStatus, getTodayStr, formatTimeFromISO, resolveSchedule } from '@/lib/attendance';
import type { AttendanceStatus } from '@/types';

export default function CheckOutPage() {
  const { currentUser } = useAuthStore();
  const { attendances, updateAttendance } = useAttendanceStore();
  const { overtimeSettings, workSchedules } = useDataStore();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [earlyReason, setEarlyReason] = useState('');
  const [selfieUrl, setSelfieUrl] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  if (!currentUser) return null;

  const todayStr = getTodayStr();
  const todayAttendance = attendances.find(
    (a) => a.employee_id === currentUser.id && a.date === todayStr
  );

  if (!todayAttendance || todayAttendance.check_out_time) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">
          {!todayAttendance ? 'Belum Check In' : 'Sudah Check Out'}
        </h2>
        <p className="text-muted-foreground mb-4">
          {!todayAttendance
            ? 'Anda belum melakukan check-in hari ini.'
            : `Anda sudah check-out pada ${formatTimeFromISO(todayAttendance.check_out_time!)}`}
        </p>
        <Button onClick={() => navigate('/dashboard')}>Kembali ke Dashboard</Button>
      </div>
    );
  }

  // Resolve the real schedule for today (handles Saturday 15:00, etc.)
  const today = new Date();
  const schedule = resolveSchedule(
    currentUser,
    today,
    workSchedules,
  );
  const scheduledEnd = schedule.end;
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const scheduledEndMinutes = parseInt(scheduledEnd.split(':')[0]) * 60 + parseInt(scheduledEnd.split(':')[1]);
  const isEarlyLeave = nowMinutes < scheduledEndMinutes;

  const earlyMinutes = isEarlyLeave ? scheduledEndMinutes - nowMinutes : 0;
  const overtimeMinutes = !isEarlyLeave
    ? calculateOvertimeMinutes(now.toISOString(), scheduledEnd, overtimeSettings)
    : 0;

  const handleConfirm = () => {
    const checkOutTime = new Date().toISOString();
    const earlyLeaveMin = calculateEarlyLeaveMinutes(checkOutTime, scheduledEnd);
    const otMinutes = calculateOvertimeMinutes(checkOutTime, scheduledEnd, overtimeSettings);
    const newStatus = determineCheckOutStatus(todayAttendance.status, earlyLeaveMin, otMinutes);

    updateAttendance(todayAttendance.id, {
      check_out_time: checkOutTime,
      status: newStatus as AttendanceStatus,
      early_leave_minutes: earlyLeaveMin,
      overtime_minutes: otMinutes,
      notes: earlyReason ? `Pulang cepat: ${earlyReason}` : todayAttendance.notes,
    });

    setCompleted(true);
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  if (completed) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold">Check Out Berhasil! ✅</h2>
          <p className="text-muted-foreground">
            Tercatat pukul {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </p>
          {overtimeMinutes > 0 && (
            <p className="text-sm text-blue-600">Lembur: {overtimeMinutes} menit</p>
          )}
          <p className="text-sm text-muted-foreground">Mengalihkan ke dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <StepIndicator
        steps={['Info', isEarlyLeave ? 'Alasan' : 'Selfie', 'Konfirmasi']}
        currentStep={step}
      />

      {/* Step 1: Info */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Informasi Check Out
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Check In</p>
                <p className="font-semibold">{formatTimeFromISO(todayAttendance.check_in_time!)}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Jadwal Pulang</p>
                <p className="font-semibold">{scheduledEnd}</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Waktu Sekarang</p>
              <p className="font-semibold text-lg">
                {now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {isEarlyLeave && (
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} />
                  <span className="text-sm font-medium">Pulang Cepat ({earlyMinutes} menit lebih awal)</span>
                </div>
                <p className="text-xs mt-1">Anda perlu memberikan alasan pulang cepat.</p>
              </div>
            )}

            {overtimeMinutes > 0 && (
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span className="text-sm font-medium">Lembur: {overtimeMinutes} menit</span>
                </div>
              </div>
            )}

            <Button onClick={() => setStep(2)} className="w-full">
              Lanjut
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Early leave reason OR Selfie */}
      {step === 2 && isEarlyLeave && (
        <Card>
          <CardHeader>
            <CardTitle>Alasan Pulang Cepat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Masukkan alasan pulang cepat..."
              value={earlyReason}
              onChange={(e) => setEarlyReason(e.target.value)}
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Kembali
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!earlyReason.trim()}
                className="flex-1"
              >
                Lanjut
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && !isEarlyLeave && (
        <div>
          <SelfieCapture
            onCapture={(url) => {
              setSelfieUrl(url);
              setStep(3);
            }}
            onClose={() => setStep(1)}
          />
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Konfirmasi Check Out</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Waktu Check Out</span>
                <span className="font-medium">
                  {now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium">
                  {isEarlyLeave ? 'Pulang Cepat' : overtimeMinutes > 0 ? 'Lembur' : 'Normal'}
                </span>
              </div>
              {isEarlyLeave && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Alasan</span>
                  <span className="font-medium">{earlyReason}</span>
                </div>
              )}
              {overtimeMinutes > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lembur</span>
                  <span className="font-medium text-blue-600">{overtimeMinutes} menit</span>
                </div>
              )}
            </div>

            {selfieUrl && (
              <img src={selfieUrl} alt="Selfie" className="w-full h-32 object-cover rounded-lg" />
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Kembali
              </Button>
              <Button onClick={handleConfirm} className="flex-1">
                <Check size={16} className="mr-1" /> Konfirmasi
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
