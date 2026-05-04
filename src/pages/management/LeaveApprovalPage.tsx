import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { leaveRequests } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import { Check, X } from 'lucide-react';

export default function LeaveApprovalPage() {
  const { activeCompany } = useAuthStore();
  const [requests, setRequests] = useState(
    leaveRequests.filter(l => l.company_id === activeCompany?.id)
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
        <h1 className="text-2xl font-bold">Approval Cuti & Izin</h1>
        <p className="text-muted-foreground">Kelola pengajuan cuti dan izin karyawan</p>
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
                      {req.type} • {formatDate(req.start_date)} - {formatDate(req.end_date)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Alasan: {req.reason}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleReject(req.id)} className="text-red-600 hover:bg-red-50">
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
            <CardTitle className="text-base">Sudah Diproses ({processed.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {processed.map(req => (
                <div key={req.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{req.employee_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {req.type} • {formatDate(req.start_date)} - {formatDate(req.end_date)}
                    </p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {requests.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">Tidak ada pengajuan cuti</p>
        </div>
      )}
    </div>
  );
}
