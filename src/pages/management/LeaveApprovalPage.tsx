import { useAuthStore } from '@/stores/authStore';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { useDataStore } from '@/stores/dataStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatDate } from '@/lib/utils';
import { generateId } from '@/lib/attendance';
import { Check, X, Calendar } from 'lucide-react';

export default function LeaveApprovalPage() {
  const { activeCompany, currentUser } = useAuthStore();
  const { leaveRequests, updateLeaveRequest } = useAttendanceStore();
  const { employees, updateEmployee, addNotification } = useDataStore();

  const companyRequests = leaveRequests.filter(l => l.company_id === activeCompany?.id);
  const pending = companyRequests.filter(r => r.status === 'PENDING')
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
  const processed = companyRequests.filter(r => r.status !== 'PENDING')
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  const calculateDays = (start: string, end: string): number => {
    const s = new Date(start);
    const e = new Date(end);
    return Math.max(1, Math.floor((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1);
  };

  const handleApprove = (id: string) => {
    const req = leaveRequests.find(r => r.id === id);
    if (!req) return;

    updateLeaveRequest(id, { status: 'APPROVED', approved_by: currentUser?.id || 'manager' });

    // Deduct leave balance
    const employee = employees.find(e => e.id === req.employee_id);
    if (employee) {
      const days = calculateDays(req.start_date, req.end_date);
      if (req.type === 'CUTI') {
        updateEmployee(req.employee_id, { cuti_tahunan: Math.max(0, employee.cuti_tahunan - days) });
      } else if (req.type === 'SAKIT') {
        updateEmployee(req.employee_id, { cuti_sakit: Math.max(0, employee.cuti_sakit - days) });
      }
    }

    // Notify employee
    addNotification({
      id: generateId('notif'),
      company_id: req.company_id,
      user_id: req.employee_id,
      type: 'LEAVE',
      title: 'Cuti Disetujui',
      message: `Pengajuan ${req.type} Anda pada ${formatDate(req.start_date)}${req.end_date !== req.start_date ? ` s/d ${formatDate(req.end_date)}` : ''} telah disetujui.`,
      is_read: false,
      created_at: new Date().toISOString(),
    });
  };

  const handleReject = (id: string) => {
    const req = leaveRequests.find(r => r.id === id);
    if (!req) return;

    updateLeaveRequest(id, { status: 'REJECTED', approved_by: currentUser?.id || 'manager' });

    // Notify employee
    addNotification({
      id: generateId('notif'),
      company_id: req.company_id,
      user_id: req.employee_id,
      type: 'LEAVE',
      title: 'Cuti Ditolak',
      message: `Pengajuan ${req.type} Anda pada ${formatDate(req.start_date)}${req.end_date !== req.start_date ? ` s/d ${formatDate(req.end_date)}` : ''} telah ditolak.`,
      is_read: false,
      created_at: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Approval Cuti & Izin</h1>
        <p className="text-muted-foreground">Kelola pengajuan cuti dan izin karyawan</p>
      </div>

      {pending.length === 0 && processed.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">Tidak ada pengajuan cuti</p>
          <p className="text-sm mt-1">Pengajuan dari karyawan akan muncul di sini</p>
        </div>
      )}

      {pending.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Menunggu Persetujuan ({pending.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {pending.map(req => (
                <div key={req.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{req.employee_name}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {req.type === 'CUTI' ? '🏖️ Cuti' : req.type === 'IZIN' ? '📋 Izin' : '🏥 Sakit'} •{' '}
                        {formatDate(req.start_date)}
                        {req.end_date && req.end_date !== req.start_date && ` s/d ${formatDate(req.end_date)}`}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Alasan: {req.reason}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Diajukan: {new Date(req.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(req.id)}
                        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <X size={14} className="mr-1" /> Tolak
                      </Button>
                      <Button size="sm" onClick={() => handleApprove(req.id)}>
                        <Check size={14} className="mr-1" /> Setujui
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {processed.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-muted-foreground">Sudah Diproses ({processed.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {processed.map(req => (
                <div key={req.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{req.employee_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {req.type} • {formatDate(req.start_date)}
                      {req.end_date && req.end_date !== req.start_date && ` s/d ${formatDate(req.end_date)}`}
                    </p>
                    <p className="text-sm text-muted-foreground">{req.reason}</p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
