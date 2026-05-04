import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Camera, X } from 'lucide-react';

interface MethodSelectorProps {
  onSelect: (method: 'QR' | 'SELFIE') => void;
  onClose: () => void;
}

export function MethodSelector({ onSelect, onClose }: MethodSelectorProps) {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-medium">Pilih Metode Absensi</p>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onSelect('QR')}
            className="flex flex-col items-center gap-3 p-6 rounded-lg border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <QrCode className="w-7 h-7 text-blue-600" />
            </div>
            <div className="text-center">
              <p className="font-medium text-sm">Scan QR</p>
              <p className="text-xs text-muted-foreground">Scan QR Code karyawan</p>
            </div>
          </button>

          <button
            onClick={() => onSelect('SELFIE')}
            className="flex flex-col items-center gap-3 p-6 rounded-lg border-2 border-dashed hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Camera className="w-7 h-7 text-emerald-600" />
            </div>
            <div className="text-center">
              <p className="font-medium text-sm">Selfie</p>
              <p className="text-xs text-muted-foreground">Ambil foto selfie</p>
            </div>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
