import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/common/PageHeader';
import { useDataStore } from '@/stores/dataStore';
import { Clock, Save } from 'lucide-react';

export default function OvertimeSettings() {
  const { overtimeSettings, setOvertimeSettings } = useDataStore();

  const [tolerance, setTolerance] = useState(String(overtimeSettings.tolerance_minutes));
  const [maxMinutes, setMaxMinutes] = useState(String(overtimeSettings.lembur_max_minutes));
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setOvertimeSettings({
      tolerance_minutes: parseInt(tolerance) || 15,
      lembur_max_minutes: parseInt(maxMinutes) || 180,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengaturan Lembur"
        subtitle="Konfigurasi toleransi dan batas lembur"
        backTo="/settings"
      />

      <form onSubmit={handleSave} className="space-y-4 max-w-lg">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Toleransi & Batas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Toleransi Lembur (menit)</label>
              <Input
                type="number"
                min="0"
                max="60"
                value={tolerance}
                onChange={(e) => setTolerance(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Waktu kerja melebihi jadwal kurang dari toleransi ini tidak dihitung lembur.
                Contoh: jika toleransi 15 menit, pulang jam 17:10 tidak dihitung lembur.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Maksimal Lembur per Hari (menit)</label>
              <Input
                type="number"
                min="30"
                max="480"
                value={maxMinutes}
                onChange={(e) => setMaxMinutes(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Batas maksimal lembur yang dihitung per hari. Contoh: 180 menit = 3 jam.
              </p>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm font-medium mb-1">Ringkasan:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Toleransi: {tolerance} menit setelah jam pulang</li>
                <li>• Maks lembur: {maxMinutes} menit ({(parseInt(maxMinutes) / 60).toFixed(1)} jam) per hari</li>
                <li>• Lembur dihitung otomatis saat check-out melebihi toleransi</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="gap-2">
          <Save className="h-4 w-4" />
          {saved ? '✓ Tersimpan!' : 'Simpan Pengaturan'}
        </Button>
      </form>
    </div>
  );
}
