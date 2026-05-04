import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/common/PageHeader';
import { useDataStore } from '@/stores/dataStore';
import { formatCurrency } from '@/lib/utils';
import { DollarSign, Save } from 'lucide-react';

export default function PayrollSettings() {
  const { payrollRates, setPayrollRates } = useDataStore();

  const [lemburRate, setLemburRate] = useState(String(payrollRates.lembur_rate_per_jam));
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPayrollRates({
      lembur_rate_per_jam: parseInt(lemburRate) || 25000,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengaturan Payroll"
        subtitle="Konfigurasi tarif dan komponen gaji"
        backTo="/settings"
      />

      <form onSubmit={handleSave} className="space-y-4 max-w-lg">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Tarif Lembur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tarif Lembur per Jam (Rp)</label>
              <Input
                type="number"
                min="0"
                step="1000"
                value={lemburRate}
                onChange={(e) => setLemburRate(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Tarif default per jam lembur. Saat ini: {formatCurrency(parseInt(lemburRate) || 0)}/jam
              </p>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm font-medium mb-2">Komponen Gaji:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• <strong>Gaji Pokok</strong> — dari data karyawan (base_salary)</li>
                <li>• <strong>Lembur</strong> — jam lembur × tarif per jam</li>
                <li>• <strong>Tunjangan</strong> — ditambahkan manual per karyawan</li>
                <li>• <strong>Potongan Keterlambatan</strong> — dihitung otomatis</li>
                <li>• <strong>Potongan Ketidakhadiran</strong> — dihitung otomatis</li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Contoh Perhitungan:</p>
              <div className="text-xs text-blue-600 dark:text-blue-400 space-y-0.5">
                <p>Karyawan lembur 2 jam dalam sebulan:</p>
                <p>Lembur = 2 jam × {formatCurrency(parseInt(lemburRate) || 0)} = {formatCurrency((parseInt(lemburRate) || 0) * 2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Potongan Otomatis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="text-sm font-medium">Potongan Keterlambatan</p>
                <p className="text-xs text-muted-foreground">Dihitung berdasarkan total menit terlambat</p>
              </div>
              <span className="text-xs bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 px-2 py-1 rounded-full">
                Aktif
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="text-sm font-medium">Potongan Ketidakhadiran</p>
                <p className="text-xs text-muted-foreground">Dihitung berdasarkan hari tidak hadir tanpa izin</p>
              </div>
              <span className="text-xs bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 px-2 py-1 rounded-full">
                Aktif
              </span>
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
