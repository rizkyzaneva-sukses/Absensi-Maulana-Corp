import { useState, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/stores/authStore';

import { useAttendanceStore } from '@/stores/attendanceStore';

import { useDataStore } from '@/stores/dataStore';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

import { PageHeader } from '@/components/common/PageHeader';

import { generateId } from '@/lib/attendance';

import { Calendar, FileText, Check, AlertTriangle } from 'lucide-react';

import type { LeaveRequest } from '@/types';



export default function LeaveRequestForm() {

  const { currentUser, activeCompany } = useAuthStore();

  const { addLeaveRequest } = useAttendanceStore();

  const { addNotification, employees } = useDataStore();

  const navigate = useNavigate();



  const [type, setType] = useState<'CUTI' | 'IZIN' | 'SAKIT'>('CUTI');

  const [startDate, setStartDate] = useState('');

  const [endDate, setEndDate] = useState('');

  const [reason, setReason] = useState('');

  const [submitted, setSubmitted] = useState(false);



  if (!currentUser || !activeCompany) return null;



  // Calculate requested days

  const requestedDays = useMemo(() => {

    if (!startDate) return 0;

    const end = endDate || startDate;

    const start = new Date(startDate);

    const e = new Date(end);

    return Math.max(1, Math.floor((e.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  }, [startDate, endDate]);



  const isOverBalance =

    type === 'CUTI' && requestedDays > (currentUser.cuti_tahunan || 0);



  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();



    const request: LeaveRequest = {

      id: generateId('leave'),

      company_id: activeCompany.id,

      employee_id: currentUser.id,

      employee_name: currentUser.full_name,

      type,

      start_date: startDate,

      end_date: endDate || startDate,

      reason,

      status: 'PENDING',

      approved_by: null,

      created_at: new Date().toISOString(),

    };



    addLeaveRequest(request);
    // Notify admin via Telegram
    fetch('/api/telegram/notify-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'leave', employee_name: currentUser?.full_name || '', details: `${request.type} ${request.start_date}${request.end_date !== request.start_date ? ' s/d ' + request.end_date : ''}`, date: request.start_date, reason: request.reason }),
    }).catch(() => {});

    // Create notification for all managers/admins/developers in the company
    const typeLabel = type === 'CUTI' ? 'Cuti' : type === 'IZIN' ? 'Izin' : 'Sakit';
    const approverRoles = ['MANAGER', 'COO', 'COMPANY_ADMIN', 'DEVELOPER', 'SUPER_ADMIN'];
    const approvers = employees.filter(e => e.company_id === activeCompany.id && e.is_active && approverRoles.includes(e.role));
    for (const mgr of approvers) {
      addNotification({
        id: generateId('notif'),
        company_id: activeCompany.id,
        user_id: mgr.id,
        type: 'LEAVE',
        title: `Pengajuan ${typeLabel} Baru`,
        message: `${currentUser.full_name} mengajukan ${typeLabel} pada ${startDate}`,
        is_read: false,
        created_at: new Date().toISOString(),
      });
    }


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

          <h2 className="text-2xl font-bold">Pengajuan Terkirim! ✅</h2>

          <p className="text-muted-foreground">Menunggu persetujuan atasan</p>

        </div>

      </div>

    );

  }



  return (

    <div className="max-w-lg mx-auto">

      <PageHeader title="Ajukan Cuti/Izin" subtitle="Isi form pengajuan cuti atau izin" backTo="/my-requests" />



      <Card>

        <CardHeader>

          <CardTitle className="flex items-center gap-2 text-base">

            <Calendar size={18} /> Sisa Cuti

          </CardTitle>

        </CardHeader>

        <CardContent>

          <div className="grid grid-cols-2 gap-4 text-center">

            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30">

              <p className="text-2xl font-bold text-blue-600">{currentUser.cuti_tahunan ?? 0}</p>

              <p className="text-xs text-muted-foreground">Cuti Tahunan</p>

            </div>

            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30">

              <p className="text-2xl font-bold text-green-600">{currentUser.cuti_sakit ?? 0}</p>

              <p className="text-xs text-muted-foreground">Cuti Sakit</p>

            </div>

          </div>

          {isOverBalance && (

            <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-sm">

              <AlertTriangle size={16} className="mt-0.5 shrink-0" />

              <span>Sisa cuti tahunan tidak mencukupi ({requestedDays} hari diajukan, sisa {currentUser.cuti_tahunan ?? 0} hari).</span>

            </div>

          )}

        </CardContent>

      </Card>



      <Card>

        <CardHeader>

          <CardTitle className="flex items-center gap-2 text-base">

            <Calendar size={18} /> Form Pengajuan

          </CardTitle>

        </CardHeader>

        <CardContent>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Type */}

            <div className="space-y-2">

              <label className="text-sm font-medium">Jenis Pengajuan</label>

              <div className="grid grid-cols-3 gap-2">

                {(['CUTI', 'IZIN', 'SAKIT'] as const).map((t) => (

                  <button

                    key={t}

                    type="button"

                    onClick={() => setType(t)}

                    className={`p-2 rounded-lg border text-sm font-medium transition-colors ${

                      type === t

                        ? 'border-primary bg-primary/10 text-primary'

                        : 'border-border hover:bg-muted'

                    }`}

                  >

                    {t === 'CUTI' ? '🏖️ Cuti' : t === 'IZIN' ? '📋 Izin' : '🏥 Sakit'}

                  </button>

                ))}

              </div>

            </div>



            {/* Dates */}

            <div className="grid grid-cols-2 gap-3">

              <div className="space-y-2">

                <label className="text-sm font-medium">Tanggal Mulai</label>

                <Input

                  type="date"

                  value={startDate}

                  onChange={(e) => setStartDate(e.target.value)}

                  required

                />

              </div>

              <div className="space-y-2">

                <label className="text-sm font-medium">Tanggal Selesai</label>

                <Input

                  type="date"

                  value={endDate}

                  onChange={(e) => setEndDate(e.target.value)}

                  min={startDate}

                />

              </div>

            </div>



            {/* Reason */}

            <div className="space-y-2">

              <label className="text-sm font-medium">Alasan</label>

              <textarea

                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

                placeholder="Jelaskan alasan pengajuan..."

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

              <Button type="submit" className="flex-1" disabled={!startDate || !reason}>

                <FileText size={16} className="mr-1" /> Kirim Pengajuan

              </Button>

            </div>

          </form>

        </CardContent>

      </Card>

    </div>

  );

}