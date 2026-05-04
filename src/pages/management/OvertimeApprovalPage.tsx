import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { overtimeRequests } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import { Check, X } from 'lucide-react';

export default function OvertimeApprovalPage() {
  const { activeCompany } = useAuthStore();
  const [requests, setRequests] = useState(
    overtimeRequests.filter(o => o.company_id === activeCompany?.id)
  );

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' as const } : r));
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' as const } : r));
  };

  const pending = requests.filter(r => r.status === 'PENDING');
  const processed = requests.filter(r => r.status !== 'PENDING');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Approval Lembur</h1>
        <p className="text-muted-foreground">Kelola pengajuan lembur karyawan</p>
      </div>

      {pending.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Menunggu Persetujuan ({pending.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {pending.map(req => (
                <div key={req.id} className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{req.employee_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(req.date)} • {req.start_time} - {req.end_time} ({req.duration_hours} jam)
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Alasan: {req.reason}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleReject(req.id)} className="text-red-600">
                      <X size={16} className="mr-1" /> Tolak
                    </Button>
                    <Button size="sm" onClick={() => handleApprove(req.id)}>
                      <Check size={16} className="mr-1" /> Setujui
                    </Button>
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
            <CardTitle className="text-base">Sudah Diproses</CardTitle>
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
