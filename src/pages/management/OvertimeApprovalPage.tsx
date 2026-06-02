import { useAuthStore } from '@/stores/authStore';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatDate } from '@/lib/utils';
import { Check, X, Clock } from 'lucide-react';

export default function OvertimeApprovalPage() {
  const { activeCompany, currentUser } = useAuthStore();
  const { overtimeRequests, updateOvertimeRequest } = useAttendanceStore();

  const companyRequests = overtimeRequests.filter(o => o.company_id === activeCompany?.id);
  const pending = companyRequests.filter(r => r.status === 'PENDING')
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
  const processed = companyRequests.filter(r => r.status !== 'PENDING')
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  const handleApprove = (id: string) => {
    updateOvertimeRequest(id, { status: 'APPROVED', approved_by: currentUser?.id || 'manager' });
  };

  const handleReject = (id: string) => {
    updateOvertimeRequest(id, { status: 'REJECTED', approved_by: currentUser?.id || 'manager' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Approval Lembur</h1>
        <p className="text-muted-foreground">Kelola pengajuan lembur karyawan</p>
      </div>

      {pending.length === 0 && processed.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">Tidak ada pengajuan lembur</p>
          <p className="text-sm mt-1">Pengajuan lembur dari karyawan akan muncul di sini</p>
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
                        ⏰ {formatDate(req.date)} • {req.start_time} – {req.end_time} •{' '}
                        <strong>{req.duration_hours} jam</strong>
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
                      {formatDate(req.date)} • {req.duration_hours} jam
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
