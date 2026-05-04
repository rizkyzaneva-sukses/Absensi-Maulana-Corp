import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { useAuthStore } from '@/stores/authStore';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { getStatusColor } from '@/lib/utils';
import { FileEdit, Check, X, Eye } from 'lucide-react';
import type { AttendanceCorrection } from '@/types';

export default function CorrectionApprovalPage() {
  const { currentUser, activeCompany } = useAuthStore();
  const { corrections, updateCorrection, updateAttendance } = useAttendanceStore();
  const companyId = activeCompany?.id || currentUser?.company_id || '';

  const companyCorrections = corrections.filter((c) => c.company_id === companyId);
  const pending = companyCorrections.filter((c) => c.status === 'PENDING');
  const processed = companyCorrections.filter((c) => c.status !== 'PENDING');

  const [viewDetail, setViewDetail] = useState<AttendanceCorrection | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showReject, setShowReject] = useState<AttendanceCorrection | null>(null);

  const formatTime = (isoTime: string | null) => {
    if (!isoTime) return '-';
    const date = new Date(isoTime);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const handleApprove = (correction: AttendanceCorrection) => {
    updateCorrection(correction.id, {
      status: 'APPROVED',
      approved_by: currentUser?.user_email || '',
    });

    // Also update the attendance record
    updateAttendance(correction.attendance_id, {
      check_in_time: correction.corrected_check_in,
      check_out_time: correction.corrected_check_out,
      notes: `Dikoreksi: ${correction.reason}`,
    });
  };

  const handleReject = () => {
    if (!showReject) return;
    updateCorrection(showReject.id, {
      status: 'REJECTED',
      approved_by: currentUser?.user_email || '',
    });
    setShowReject(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Persetujuan Koreksi"
        subtitle="Kelola pengajuan koreksi absensi karyawan"
        backTo="/dashboard"
      />

      {/* Pending */}
      {pending.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              Menunggu Persetujuan
              <Badge variant="destructive">{pending.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {pending.map((corr) => (
                <div key={corr.id} className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{corr.employee_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Tanggal: {new Date(corr.date).toLocaleDateString('id-ID')}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatTime(corr.original_check_in)} → {formatTime(corr.corrected_check_in)} |{' '}
                      {formatTime(corr.original_check_out)} → {formatTime(corr.corrected_check_out)}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setViewDetail(corr)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-green-600 hover:text-green-700"
                      onClick={() => handleApprove(corr)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => setShowReject(corr)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {pending.length === 0 && processed.length === 0 && (
        <EmptyState
          icon={FileEdit}
          title="Tidak ada pengajuan koreksi"
          description="Pengajuan koreksi absensi dari karyawan akan muncul di sini"
        />
      )}

      {/* Processed */}
      {processed.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Riwayat</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {processed.map((corr) => (
                <div key={corr.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{corr.employee_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(corr.date).toLocaleDateString('id-ID')} • {corr.reason}
                    </p>
                  </div>
                  <Badge className={getStatusColor(corr.status)} variant="outline">
                    {corr.status === 'APPROVED' ? 'Disetujui' : 'Ditolak'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!viewDetail} onOpenChange={(open) => !open && setViewDetail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Koreksi</DialogTitle>
          </DialogHeader>
          {viewDetail && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Karyawan</p>
                  <p className="font-medium">{viewDetail.employee_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tanggal</p>
                  <p className="font-medium">{new Date(viewDetail.date).toLocaleDateString('id-ID')}</p>
                </div>
              </div>

              <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                <p className="text-sm font-medium">Perubahan Waktu:</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Check-in Asli</p>
                    <p className="font-mono">{formatTime(viewDetail.original_check_in)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Check-in Koreksi</p>
                    <p className="font-mono text-primary">{formatTime(viewDetail.corrected_check_in)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Check-out Asli</p>
                    <p className="font-mono">{formatTime(viewDetail.original_check_out)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Check-out Koreksi</p>
                    <p className="font-mono text-primary">{formatTime(viewDetail.corrected_check_out)}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Alasan</p>
                <p className="text-sm">{viewDetail.reason}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Diajukan: {new Date(viewDetail.created_at).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDetail(null)}>
              Tutup
            </Button>
            {viewDetail?.status === 'PENDING' && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setShowReject(viewDetail);
                    setViewDetail(null);
                  }}
                >
                  Tolak
                </Button>
                <Button
                  onClick={() => {
                    handleApprove(viewDetail!);
                    setViewDetail(null);
                  }}
                >
                  Setujui
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={!!showReject} onOpenChange={(open) => !open && setShowReject(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tolak Koreksi</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Tolak pengajuan koreksi dari {showReject?.employee_name}?
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium">Alasan Penolakan (opsional)</label>
              <Input
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Alasan penolakan..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReject(null)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Tolak
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
