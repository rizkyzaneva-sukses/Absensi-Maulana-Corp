import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { useDataStore } from '@/stores/dataStore';
import type { WorkSchedule } from '@/stores/dataStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StepIndicator } from '@/components/common/StepIndicator';
import { LocationValidator } from '@/components/attendance/LocationValidator';
import { SelfieCapture } from '@/components/attendance/SelfieCapture';
import { generateId, getTodayStr, determineCheckInStatus, resolveSchedule } from '@/lib/attendance';
import type { GeoValidationResult } from '@/lib/geo';
import { cn } from '@/lib/utils';
import { MapPin, Camera, QrCode, Check, ChevronRight } from 'lucide-react';
import type { GeoPoint, CheckInMethod } from '@/types';

export default function CheckInPage() {
  const { currentUser, activeCompany } = useAuthStore();
  const { attendances, addAttendance } = useAttendanceStore();
  const { locations, workSchedules } = useDataStore();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [locationValid, setLocationValid] = useState(false);
  const [userLocation, setUserLocation] = useState<GeoPoint | null>(null);
  const [method, setMethod] = useState<CheckInMethod | null>(null);
  const [selfieData, setSelfieData] = useState<string>('');
  const [completed, setCompleted] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<string>('');

  const companyId = activeCompany?.id || currentUser?.company_id || '';
  const employeeId = currentUser?.id || '';
  const today = getTodayStr();

  // Check if already checked in today
  const todayRecord = attendances.find(
    (a) => a.employee_id === employeeId && a.company_id === companyId && a.date === today
  );

  const companyLocations = locations.filter((l) => l.company_id === companyId);

  const handleLocationValidated = (result: GeoValidationResult) => {
    const valid = result.status === 'VALID_RADIUS';
    setLocationValid(valid);
    if (result.location) setUserLocation(result.location);
    if (valid) {
      setTimeout(() => setStep(2), 500);
    }
  };

  const handleMethodSelect = (m: CheckInMethod) => {
    setMethod(m);
    if (m === 'QR') {
      // For QR, skip selfie step and go to confirm
      setStep(3);
    }
  };

  const handleSelfieCapture = (dataUrl: string) => {
    setSelfieData(dataUrl);
    setStep(3);
  };

  const handleConfirm = () => {
    const now = new Date();
    const checkInTime = now.toISOString();

    // Determine status based on employee's resolved schedule
    const schedule = currentUser ? resolveSchedule(currentUser, now, workSchedules as WorkSchedule[]) : { start: '08:00', end: '17:00', is_workday: true };
    const status = determineCheckInStatus(checkInTime, schedule.start, false);
    const scheduledStartMinutes = parseInt(schedule.start.split(':')[0]) * 60 + parseInt(schedule.start.split(':')[1]);
    const lateMinutes = status === 'TERLAMBAT'
      ? Math.max(0, (now.getHours() * 60 + now.getMinutes()) - scheduledStartMinutes)
      : 0;

    const record = {
      id: generateId('ATT'),
      company_id: companyId,
      employee_id: employeeId,
      date: today,
      check_in_time: checkInTime,
      check_out_time: null,
      status,
      check_in_method: method,
      check_in_location: userLocation,
      check_out_location: null,
      check_in_photo_url: selfieData || '',
      notes: '',
      is_auto_checkout: false,
      overtime_minutes: 0,
      late_minutes: lateMinutes,
      early_leave_minutes: 0,
    };

    addAttendance(record);
    setCheckInStatus(status);
    setCompleted(true);

    setTimeout(() => {
      navigate('/dashboard');
    }, 2500);
  };

  // Already checked in
  if (todayRecord) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto">
            <Check className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold">Sudah Check-in Hari Ini</h2>
          <p className="text-muted-foreground">
            Tercatat pukul{' '}
            {todayRecord.check_in_time
              ? new Date(todayRecord.check_in_time).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '-'}
          </p>
          {!todayRecord.check_out_time && (
            <Button onClick={() => navigate('/check-out')} className="mt-4">
              Check-out Sekarang
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Success state
  if (completed) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold">Check-in Berhasil! ✅</h2>
          <p className="text-muted-foreground">
            Tercatat pukul {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          </p>
          {checkInStatus === 'TERLAMBAT' && (
            <p className="text-sm text-amber-600">⚠️ Status: Terlambat</p>
          )}
          <p className="text-sm text-muted-foreground">Mengalihkan ke dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Step Indicator */}
      <StepIndicator
        steps={['Lokasi', 'Metode', 'Konfirmasi']}
        currentStep={step}
      />

      {/* Step 1: Location Validation */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Validasi Lokasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LocationValidator
              locations={companyLocations}
              onValidated={handleLocationValidated}
            />
          </CardContent>
        </Card>
      )}

      {/* Step 2: Method Selection */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Pilih Metode Check-in</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div
              onClick={() => handleMethodSelect('QR')}
              className={cn(
                'p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-4',
                method === 'QR' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
              )}
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <QrCode className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Scan QR Code</p>
                <p className="text-sm text-muted-foreground">Scan QR yang tersedia di kantor</p>
              </div>
            </div>
            <div
              onClick={() => setMethod('SELFIE')}
              className={cn(
                'p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-4',
                method === 'SELFIE' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
              )}
            >
              <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <Camera className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <p className="font-medium">Selfie</p>
                <p className="text-sm text-muted-foreground">Ambil foto selfie sebagai bukti kehadiran</p>
              </div>
            </div>

            {method === 'SELFIE' && (
              <div className="mt-4">
                <SelfieCapture onCapture={handleSelfieCapture} onClose={() => setMethod(null)} />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Konfirmasi Check-in</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 p-4 rounded-lg bg-muted/50">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Nama</span>
                <span className="text-sm font-medium">{currentUser?.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Waktu</span>
                <span className="text-sm font-medium">
                  {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Lokasi</span>
                <span className="text-sm font-medium text-emerald-600">✓ Dalam radius</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Metode</span>
                <span className="text-sm font-medium">
                  {method === 'QR' ? 'QR Code' : method === 'SELFIE' ? 'Selfie' : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="text-sm font-medium">
                  {new Date().getHours() > 8 || (new Date().getHours() === 8 && new Date().getMinutes() > 0)
                    ? '⚠️ Terlambat'
                    : '✅ Tepat Waktu'}
                </span>
              </div>
            </div>

            {selfieData && (
              <div className="flex justify-center">
                <img
                  src={selfieData}
                  alt="Selfie"
                  className="w-24 h-24 rounded-lg object-cover border"
                />
              </div>
            )}

            <Button onClick={handleConfirm} className="w-full" size="lg">
              Konfirmasi Check-in
            </Button>
            <Button variant="outline" onClick={() => setStep(2)} className="w-full">
              Kembali
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
