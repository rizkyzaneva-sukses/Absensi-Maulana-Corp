import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Clock, DollarSign, CalendarDays, MapPin, Timer } from 'lucide-react';
import { TelegramChannelCard } from './TelegramChannelCard';

export default function SettingsPage() {
  const { activeCompany } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pengaturan</h1>
        <p className="text-muted-foreground">Konfigurasi {activeCompany?.name}</p>
      </div>

      {/* Quick Links to Sub-Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate('/settings/holidays')}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-950 flex items-center justify-center">
              <CalendarDays className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-sm">Hari Libur</p>
              <p className="text-xs text-muted-foreground">Kalender libur</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate('/settings/schedules')}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
              <Timer className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-sm">Jadwal Kerja</p>
              <p className="text-xs text-muted-foreground">Jam kerja karyawan</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate('/settings/locations')}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-sm">Lokasi</p>
              <p className="text-xs text-muted-foreground">Titik absensi</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => navigate('/settings/overtime')}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-sm">Lembur</p>
              <p className="text-xs text-muted-foreground">Pengaturan lembur</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="company">
        <TabsList>
          <TabsTrigger value="company">Perusahaan</TabsTrigger>
          <TabsTrigger value="schedule">Jam Kerja</TabsTrigger>
          <TabsTrigger value="payroll">Gaji & Lembur</TabsTrigger>
          <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 size={18} /> Informasi Perusahaan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nama Perusahaan</label>
                  <Input defaultValue={activeCompany?.name} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Industri</label>
                  <Input defaultValue={activeCompany?.industry} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Alamat</label>
                  <Input defaultValue={activeCompany?.address} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">NPWP</label>
                  <Input defaultValue={activeCompany?.npwp} />
                </div>
              </div>
              <Button>Simpan Perubahan</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock size={18} /> Jam Kerja
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Jam Masuk</label>
                  <Input type="time" defaultValue="08:00" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Jam Pulang</label>
                  <Input type="time" defaultValue="17:00" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Toleransi Terlambat (menit)</label>
                  <Input type="number" defaultValue="15" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Radius Check-in (meter)</label>
                  <Input type="number" defaultValue="200" />
                </div>
              </div>
              <Button>Simpan Perubahan</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign size={18} /> Pengaturan Gaji & Lembur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hari Kerja per Bulan</label>
                  <Input type="number" defaultValue="22" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rate Lembur (x gaji/jam)</label>
                  <Input type="number" step="0.5" defaultValue="1.5" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Potongan Terlambat per Menit</label>
                  <Input type="number" defaultValue="5000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Potongan Tidak Hadir</label>
                  <Input type="number" defaultValue="100000" />
                </div>
              </div>
              <Button>Simpan Perubahan</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          {activeCompany ? (
            <TelegramChannelCard companyId={activeCompany.id} companyName={activeCompany.name} />
          ) : (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Pilih perusahaan dulu untuk mengatur channel Telegram.
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
