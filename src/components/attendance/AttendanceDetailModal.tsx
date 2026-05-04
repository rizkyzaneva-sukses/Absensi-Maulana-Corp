import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/common/StatusBadge';
import type { Attendance } from '@/types';
import { formatDate, formatTime } from '@/lib/utils';
import { Clock, MapPin, Camera, FileText } from 'lucide-react';

interface AttendanceDetailModalProps {
  attendance: Attendance | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AttendanceDetailModal({ attendance, open, onOpenChange }: AttendanceDetailModalProps) {
  if (!attendance) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detail Absensi</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Date & Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{formatDate(attendance.date)}</span>
            <StatusBadge status={attendance.status} />
          </div>

          {/* Check-in/out times */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Clock size={14} />
                Check In
              </div>
              <p className="font-semibold">{formatTime(attendance.check_in_time)}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Clock size={14} />
                Check Out
              </div>
              <p className="font-semibold">{formatTime(attendance.check_out_time)}</p>
            </div>
          </div>

          {/* Method */}
          {attendance.check_in_method && (
            <div className="flex items-center gap-2 text-sm">
              <Camera size={14} className="text-muted-foreground" />
              <span className="text-muted-foreground">Metode:</span>
              <span className="font-medium">{attendance.check_in_method}</span>
            </div>
          )}

          {/* Location */}
          {attendance.check_in_location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={14} className="text-muted-foreground" />
              <span className="text-muted-foreground">Lokasi:</span>
              <span className="font-medium">
                {attendance.check_in_location.lat.toFixed(6)}, {attendance.check_in_location.lng.toFixed(6)}
              </span>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            {attendance.late_minutes > 0 && (
              <div className="text-center p-2 rounded bg-amber-50 dark:bg-amber-900/20">
                <p className="text-xs text-muted-foreground">Terlambat</p>
                <p className="font-semibold text-amber-600">{attendance.late_minutes} min</p>
              </div>
            )}
            {attendance.early_leave_minutes > 0 && (
              <div className="text-center p-2 rounded bg-orange-50 dark:bg-orange-900/20">
                <p className="text-xs text-muted-foreground">Pulang Cepat</p>
                <p className="font-semibold text-orange-600">{attendance.early_leave_minutes} min</p>
              </div>
            )}
            {attendance.overtime_minutes > 0 && (
              <div className="text-center p-2 rounded bg-blue-50 dark:bg-blue-900/20">
                <p className="text-xs text-muted-foreground">Lembur</p>
                <p className="font-semibold text-blue-600">{attendance.overtime_minutes} min</p>
              </div>
            )}
          </div>

          {/* Photo */}
          {attendance.check_in_photo_url && (
            <div>
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                <Camera size={14} /> Foto Check-in
              </p>
              <img
                src={attendance.check_in_photo_url}
                alt="Check-in selfie"
                className="w-full h-48 object-cover rounded-lg bg-muted"
              />
            </div>
          )}

          {/* Notes */}
          {attendance.notes && (
            <div className="flex items-start gap-2 text-sm">
              <FileText size={14} className="text-muted-foreground mt-0.5" />
              <div>
                <span className="text-muted-foreground">Catatan:</span>
                <p className="mt-0.5">{attendance.notes}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
