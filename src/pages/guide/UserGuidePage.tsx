import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/common/PageHeader';
import { useAuthStore } from '@/stores/authStore';
import {
  BookOpen, Users, Clock, FileText, Settings, Shield,
  CheckCircle, ArrowRight, ChevronDown, ChevronUp,
  LogIn, LogOut, Calendar, DollarSign, BarChart3,
  MapPin, AlertTriangle, Briefcase,
  ScrollText, ListTodo, Printer, Info, Zap
} from 'lucide-react';

function Accordion({ title, icon, children, defaultOpen = false, badge }: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium">{title}</span>
          {badge}
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && <CardContent className="pt-0 pb-4 px-4">{children}</CardContent>}
    </Card>
  );
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
        {number}
      </div>
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function WorkflowArrow() {
  return (
    <div className="flex justify-center py-0.5 pl-9">
      <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
    </div>
  );
}

function InfoBox({ children, color = 'blue' }: { children: React.ReactNode; color?: 'blue' | 'amber' | 'green' | 'red' }) {
  const colors = {
    blue: 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300',
    amber: 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300',
    green: 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300',
    red: 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300',
  };
  return (
    <div className={`p-3 rounded-lg text-xs ${colors[color]}`}>
      {children}
    </div>
  );
}

function SectionLabel({ badge, label }: { badge: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 pt-4 border-t">
      {badge}
      <span className="text-sm font-semibold">{label}</span>
    </div>
  );
}

function getRoleLevel(role: string): number {
  switch (role) {
    case 'SUPER_ADMIN': return 5;
    case 'COMPANY_ADMIN': return 4;
    case 'COO': return 3;
    case 'MANAGER': return 2;
    case 'KARYAWAN': return 1;
    default: return 1;
  }
}

function getRoleLabel(role: string): string {
  switch (role) {
    case 'SUPER_ADMIN': return 'Owner / Super Admin';
    case 'COMPANY_ADMIN': return 'Admin Perusahaan';
    case 'COO': return 'COO';
    case 'MANAGER': return 'Manager';
    case 'KARYAWAN': return 'Karyawan';
    default: return role;
  }
}

function getRoleBadgeColor(role: string): string {
  switch (role) {
    case 'SUPER_ADMIN': return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
    case 'COMPANY_ADMIN': return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
    case 'COO': return 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300';
    case 'MANAGER': return 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300';
    case 'KARYAWAN': return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  }
}

export default function UserGuidePage() {
  const { currentUser } = useAuthStore();
  const userRole = currentUser?.role || 'KARYAWAN';
  const userLevel = getRoleLevel(userRole);

  const showKaryawan = userLevel >= 1;
  const showManager = userLevel >= 2;
  const showAdmin = userLevel >= 3;
  const showSuperAdmin = userLevel >= 4;

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <PageHeader
        title="Panduan Penggunaan"
        subtitle={`Panduan lengkap untuk: ${getRoleLabel(userRole)}`}
        backTo="/dashboard"
      />

      {/* Role Banner */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium">
                Role Anda:{' '}
                <Badge className={getRoleBadgeColor(userRole)}>{getRoleLabel(userRole)}</Badge>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {userLevel >= 4 && 'Anda memiliki akses penuh ke seluruh fitur — termasuk semua perusahaan yang Anda kelola.'}
                {userLevel === 3 && 'Anda dapat mengelola karyawan, pengaturan, payroll, dan menyetujui semua pengajuan.'}
                {userLevel === 2 && 'Anda dapat memonitor tim dan menyetujui pengajuan cuti, lembur, dan koreksi.'}
                {userLevel === 1 && 'Anda dapat melakukan absensi dan mengajukan cuti, lembur, atau koreksi absensi.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===================== KARYAWAN ===================== */}
      {showKaryawan && (
        <>
          <SectionLabel
            badge={<Badge className="bg-blue-100 text-blue-700">Karyawan</Badge>}
            label={userRole === 'KARYAWAN' ? 'Fitur Anda' : 'Fitur Karyawan'}
          />

          {/* Check-in */}
          <Accordion
            title="Check-in (Absen Masuk)"
            icon={<LogIn className="h-5 w-5 text-green-600" />}
            defaultOpen={userRole === 'KARYAWAN'}
          >
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Lakukan check-in setiap hari kerja saat tiba di kantor.
              </p>
              <div className="space-y-1">
                <Step number={1} title="Buka Check-in" description="Klik menu 'Check-in' di sidebar atau tombol di dashboard" />
                <WorkflowArrow />
                <Step number={2} title="Izinkan GPS" description="Klik 'Cek Lokasi Saya' dan izinkan browser mengakses lokasi" />
                <WorkflowArrow />
                <Step number={3} title="Pilih Metode Absensi" description="Pilih Scan QR Code atau Selfie sebagai bukti kehadiran" />
                <WorkflowArrow />
                <Step number={4} title="Konfirmasi" description="Cek waktu & lokasi, lalu klik 'Konfirmasi Check-in'" />
              </div>
              <InfoBox color="amber">
                <AlertTriangle className="h-3 w-3 inline mr-1" />
                <strong>Keterlambatan:</strong> Jika check-in setelah jam masuk, status otomatis menjadi <strong>TERLAMBAT</strong>. Batas toleransi diatur oleh admin.
              </InfoBox>
            </div>
          </Accordion>

          {/* Check-out */}
          <Accordion
            title="Check-out (Absen Pulang)"
            icon={<LogOut className="h-5 w-5 text-red-500" />}
          >
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Lakukan check-out setelah selesai bekerja.
              </p>
              <div className="space-y-1">
                <Step number={1} title="Buka Check-out" description="Klik menu 'Check-out' di sidebar" />
                <WorkflowArrow />
                <Step number={2} title="Review Info" description="Lihat jam check-in, total jam kerja, dan status hari ini" />
                <WorkflowArrow />
                <Step number={3} title="Selfie (opsional)" description="Ambil foto selfie sebagai bukti keluar" />
                <WorkflowArrow />
                <Step number={4} title="Konfirmasi" description="Jika pulang lebih awal, isi alasan. Lalu klik konfirmasi." />
              </div>
              <InfoBox color="blue">
                <strong>ℹ️ Lembur otomatis:</strong> Jika check-out melewati jam pulang yang ditetapkan, sistem akan menghitung jam lembur otomatis — <em>tidak perlu mengajukan lembur lagi</em>.
              </InfoBox>
            </div>
          </Accordion>

          {/* Lembur - kapan perlu ajukan */}
          <Accordion
            title="Kapan Harus Ajukan Lembur?"
            icon={<Clock className="h-5 w-5 text-purple-500" />}
            badge={<Badge className="bg-purple-100 text-purple-700 text-[10px]">Penting</Badge>}
          >
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg space-y-1">
                  <p className="text-sm font-semibold text-green-700 dark:text-green-300">✅ Tidak perlu ajukan lembur jika:</p>
                  <ul className="text-xs text-green-700 dark:text-green-300 list-disc list-inside space-y-0.5">
                    <li>Anda lembur spontan (pulang lebih malam dari biasanya)</li>
                    <li>Check-out dilakukan setelah jam kerja berakhir</li>
                    <li>Sistem otomatis menghitung selisih jam sebagai lembur</li>
                  </ul>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg space-y-1">
                  <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">📋 Perlu ajukan lembur jika:</p>
                  <ul className="text-xs text-purple-700 dark:text-purple-300 list-disc list-inside space-y-0.5">
                    <li>Lembur sudah direncanakan sebelumnya dan butuh persetujuan</li>
                    <li>Kebijakan perusahaan mengharuskan approval lembur terlebih dahulu</li>
                    <li>Lembur di hari libur atau weekend</li>
                  </ul>
                </div>
              </div>
              <InfoBox color="blue">
                <strong>💡 Alur singkat:</strong> Check-in → Bekerja → Check-out (otomatis hitung lembur jika melebihi jam kerja). Pengajuan lembur manual digunakan untuk lembur <strong>terencana</strong> yang butuh persetujuan atasan.
              </InfoBox>
            </div>
          </Accordion>

          {/* Pengajuan Cuti */}
          <Accordion
            title="Pengajuan Cuti / Izin / Sakit"
            icon={<Calendar className="h-5 w-5 text-blue-500" />}
          >
            <div className="space-y-3">
              <div className="space-y-1">
                <Step number={1} title="Buka Pengajuan Saya" description="Klik menu 'Pengajuan Saya' di sidebar" />
                <WorkflowArrow />
                <Step number={2} title="Klik 'Ajukan Cuti/Izin'" description="Tombol tersedia di bagian atas halaman" />
                <WorkflowArrow />
                <Step number={3} title="Isi Form" description="Pilih jenis (Cuti 🏖️ / Izin 📋 / Sakit 🏥), tanggal, dan alasan" />
                <WorkflowArrow />
                <Step number={4} title="Kirim & Tunggu" description="Pengajuan masuk ke atasan. Cek status di 'Pengajuan Saya'" />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded">
                  <p className="font-semibold text-yellow-700 dark:text-yellow-300">PENDING</p>
                  <p className="text-muted-foreground">Menunggu</p>
                </div>
                <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded">
                  <p className="font-semibold text-green-700 dark:text-green-300">APPROVED</p>
                  <p className="text-muted-foreground">Disetujui</p>
                </div>
                <div className="p-2 bg-red-50 dark:bg-red-950/20 rounded">
                  <p className="font-semibold text-red-700 dark:text-red-300">REJECTED</p>
                  <p className="text-muted-foreground">Ditolak</p>
                </div>
              </div>
            </div>
          </Accordion>

          {/* Ajukan Lembur Manual */}
          <Accordion
            title="Ajukan Lembur (Terencana)"
            icon={<Clock className="h-5 w-5 text-amber-500" />}
          >
            <div className="space-y-3">
              <div className="space-y-1">
                <Step number={1} title="Buka Pengajuan Saya" description="Klik tombol 'Ajukan Lembur'" />
                <WorkflowArrow />
                <Step number={2} title="Isi Form" description="Pilih tanggal, jam mulai & selesai, dan uraikan tugas lembur" />
                <WorkflowArrow />
                <Step number={3} title="Kirim" description="Pengajuan dikirim ke atasan untuk disetujui" />
              </div>
              <InfoBox color="blue">
                <strong>Perhitungan:</strong> Durasi lembur × tarif per jam. Tarif ditetapkan oleh admin di Pengaturan Payroll.
              </InfoBox>
            </div>
          </Accordion>

          {/* Koreksi */}
          <Accordion
            title="Koreksi Absensi"
            icon={<FileText className="h-5 w-5 text-amber-500" />}
          >
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Gunakan fitur ini jika ada kesalahan data absensi (lupa check-in/out, waktu tidak sesuai).
              </p>
              <div className="space-y-1">
                <Step number={1} title="Buka Pengajuan Saya → Koreksi Absensi" description="" />
                <WorkflowArrow />
                <Step number={2} title="Pilih Tanggal" description="Pilih tanggal absensi yang ingin diperbaiki" />
                <WorkflowArrow />
                <Step number={3} title="Masukkan Waktu yang Benar" description="Isi jam check-in dan check-out yang seharusnya" />
                <WorkflowArrow />
                <Step number={4} title="Isi Alasan & Kirim" description="Jelaskan penyebab kesalahan, lalu kirim" />
              </div>
              <InfoBox color="amber">
                <AlertTriangle className="h-3 w-3 inline mr-1" />
                Koreksi yang disetujui atasan akan <strong>memperbarui data absensi secara otomatis</strong>.
              </InfoBox>
            </div>
          </Accordion>

          {/* Riwayat */}
          <Accordion
            title="Riwayat Absensi Saya"
            icon={<ScrollText className="h-5 w-5 text-muted-foreground" />}
          >
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Akses menu <strong>"Riwayat Saya"</strong> untuk melihat histori kehadiran Anda.
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                <li>Filter berdasarkan bulan</li>
                <li>Detail harian: jam masuk, jam keluar, status, durasi kerja</li>
                <li>Ringkasan bulanan: total hadir, terlambat, izin, cuti, lembur</li>
              </ul>
              <InfoBox color="green">
                <strong>ℹ️</strong> Riwayat absensi Anda <strong>selalu bisa dilihat kapan saja</strong> — tidak perlu minta ke admin.
              </InfoBox>
            </div>
          </Accordion>
        </>
      )}

      {/* ===================== MANAGER ===================== */}
      {showManager && (
        <>
          <SectionLabel
            badge={<Badge className="bg-purple-100 text-purple-700">Manager</Badge>}
            label={userRole === 'MANAGER' ? 'Fitur Khusus Anda' : 'Fitur Manager'}
          />

          <Accordion
            title="Dashboard Manager"
            icon={<BarChart3 className="h-5 w-5 text-purple-600" />}
            defaultOpen={userRole === 'MANAGER'}
          >
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Dashboard Manager menampilkan kondisi tim Anda <strong>hari ini secara real-time</strong>:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li><strong>Hadir / Terlambat / Belum Absen / Izin-Cuti</strong> — statistik ringkas</li>
                <li><strong>Menunggu Approval</strong> — jumlah pengajuan yang perlu diproses</li>
                <li><strong>Daftar karyawan terlambat</strong> hari ini</li>
                <li><strong>Daftar karyawan belum check-in</strong></li>
                <li><strong>Tabel absensi lengkap</strong> semua karyawan hari ini</li>
              </ul>
            </div>
          </Accordion>

          <Accordion
            title="Approval Cuti & Izin"
            icon={<CheckCircle className="h-5 w-5 text-green-600" />}
          >
            <div className="space-y-3">
              <div className="space-y-1">
                <Step number={1} title="Buka 'Approval Cuti'" description="Tersedia di menu sidebar" />
                <WorkflowArrow />
                <Step number={2} title="Review Pengajuan" description="Lihat nama, jenis cuti, tanggal, dan alasan karyawan" />
                <WorkflowArrow />
                <Step number={3} title="Setujui atau Tolak" description="Klik ✓ Setujui atau ✗ Tolak" />
              </div>
              <InfoBox color="green">
                Pengajuan yang sudah diproses otomatis pindah ke bagian <strong>"Sudah Diproses"</strong> sebagai arsip.
              </InfoBox>
            </div>
          </Accordion>

          <Accordion
            title="Approval Lembur"
            icon={<Clock className="h-5 w-5 text-blue-600" />}
          >
            <div className="space-y-3">
              <div className="space-y-1">
                <Step number={1} title="Buka 'Approval Lembur'" description="Tersedia di menu sidebar" />
                <WorkflowArrow />
                <Step number={2} title="Cek Detail" description="Periksa tanggal, jam, durasi, dan alasan lembur" />
                <WorkflowArrow />
                <Step number={3} title="Proses" description="Setujui jika valid, tolak jika tidak sesuai" />
              </div>
              <InfoBox color="blue">
                Lembur yang disetujui akan <strong>masuk otomatis ke perhitungan payroll</strong> bulan berjalan.
              </InfoBox>
            </div>
          </Accordion>

          <Accordion
            title="Approval Koreksi Absensi"
            icon={<FileText className="h-5 w-5 text-amber-600" />}
          >
            <div className="space-y-3">
              <div className="space-y-1">
                <Step number={1} title="Buka 'Approval Koreksi'" description="Tersedia di menu sidebar" />
                <WorkflowArrow />
                <Step number={2} title="Bandingkan Data" description="Lihat waktu asli vs waktu koreksi yang diajukan karyawan" />
                <WorkflowArrow />
                <Step number={3} title="Proses" description="Setujui → data absensi terupdate otomatis. Tolak → data tidak berubah." />
              </div>
              <InfoBox color="amber">
                <AlertTriangle className="h-3 w-3 inline mr-1" />
                <strong>Hati-hati:</strong> Setelah disetujui, data absensi berubah permanen. Pastikan sudah benar sebelum approve.
              </InfoBox>
            </div>
          </Accordion>

          <Accordion
            title="Analytics Tim"
            icon={<BarChart3 className="h-5 w-5 text-amber-600" />}
          >
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Menu <strong>"Analytics"</strong> — statistik tim secara visual:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Grafik kehadiran mingguan/bulanan</li>
                <li>Tren keterlambatan</li>
                <li>Ranking kehadiran karyawan</li>
                <li>Ringkasan lembur dan cuti per periode</li>
              </ul>
            </div>
          </Accordion>
        </>
      )}

      {/* ===================== COMPANY ADMIN ===================== */}
      {showAdmin && (
        <>
          <SectionLabel
            badge={<Badge className="bg-amber-100 text-amber-700">Admin</Badge>}
            label={userRole === 'COMPANY_ADMIN' ? 'Fitur Khusus Anda' : 'Fitur Admin Perusahaan'}
          />

          <Accordion
            title="Kelola Karyawan"
            icon={<Users className="h-5 w-5 text-blue-600" />}
            defaultOpen={userRole === 'COMPANY_ADMIN'}
          >
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Menu <strong>"Karyawan"</strong> — kelola seluruh data karyawan perusahaan:</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded">
                  <Badge variant="outline" className="text-xs shrink-0">➕ Tambah</Badge>
                  <span>Klik "Tambah Karyawan" → isi nama, ID, email, posisi, departemen, role, gaji pokok → Simpan</span>
                </div>
                <div className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                  <Badge variant="outline" className="text-xs shrink-0">✏️ Edit</Badge>
                  <span>Klik ikon pensil di kartu karyawan → ubah data → Simpan Perubahan</span>
                </div>
                <div className="flex items-start gap-2 p-2 bg-purple-50 dark:bg-purple-950/20 rounded">
                  <Badge variant="outline" className="text-xs shrink-0">👁️ Detail</Badge>
                  <span>Klik ikon mata untuk lihat informasi lengkap termasuk gaji dan status aktif</span>
                </div>
                <div className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-950/20 rounded">
                  <Badge variant="outline" className="text-xs shrink-0">🗑️ Hapus</Badge>
                  <span>Klik ikon tempat sampah → konfirmasi di dialog yang muncul</span>
                </div>
              </div>
            </div>
          </Accordion>

          <Accordion
            title="Pengaturan Jadwal Kerja"
            icon={<Clock className="h-5 w-5 text-blue-600" />}
          >
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Menu <strong>Pengaturan → Jadwal Kerja</strong>:</p>
              <div className="space-y-1">
                <Step number={1} title="Buat Jadwal Baru" description="Klik 'Tambah Jadwal' → isi nama dan deskripsi" />
                <WorkflowArrow />
                <Step number={2} title="Atur Jam Kerja" description="Tentukan jam masuk & pulang untuk Senin–Minggu" />
                <WorkflowArrow />
                <Step number={3} title="Centang Hari Kerja" description="Pilih hari-hari yang aktif bekerja" />
                <WorkflowArrow />
                <Step number={4} title="Simpan" description="Jadwal siap diassign ke karyawan" />
              </div>
            </div>
          </Accordion>

          <Accordion
            title="Pengaturan Lokasi Kantor"
            icon={<MapPin className="h-5 w-5 text-green-600" />}
          >
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Menu <strong>Pengaturan → Lokasi</strong>:</p>
              <div className="space-y-1">
                <Step number={1} title="Tambah Lokasi" description="Klik 'Tambah Lokasi' → isi nama lokasi kantor" />
                <WorkflowArrow />
                <Step number={2} title="Masukkan Koordinat GPS" description="Isi latitude & longitude (bisa copas dari Google Maps)" />
                <WorkflowArrow />
                <Step number={3} title="Atur Radius Toleransi" description="Contoh: 100 meter — karyawan harus dalam radius ini saat check-in" />
              </div>
              <InfoBox color="amber">
                <AlertTriangle className="h-3 w-3 inline mr-1" />
                Radius sebaiknya cukup luas untuk mencakup area parkir dan lobby, agar karyawan tidak gagal check-in.
              </InfoBox>
            </div>
          </Accordion>

          <Accordion
            title="Pengaturan Hari Libur"
            icon={<Calendar className="h-5 w-5 text-red-500" />}
          >
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Menu <strong>Pengaturan → Hari Libur</strong>:</p>
              <div className="space-y-1">
                <Step number={1} title="Buka Pengaturan → Hari Libur" description="" />
                <WorkflowArrow />
                <Step number={2} title="Tambah Hari Libur" description="Klik 'Tambah' → isi nama libur nasional dan tanggalnya" />
                <WorkflowArrow />
                <Step number={3} title="Simpan" description="Hari libur dikecualikan dari absensi dan payroll otomatis" />
              </div>
            </div>
          </Accordion>

          <Accordion
            title="Pengaturan Lembur & Keterlambatan"
            icon={<Settings className="h-5 w-5 text-purple-600" />}
          >
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Menu <strong>Pengaturan → Lembur</strong>:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li><strong>Toleransi Keterlambatan:</strong> Menit grace period sebelum dianggap terlambat (default: 15 menit)</li>
                <li><strong>Maks Jam Lembur per Hari:</strong> Batas maksimal lembur yang bisa dihitung (default: 4 jam)</li>
                <li><strong>Aktif/Nonaktif Lembur:</strong> Bisa menonaktifkan fitur lembur sepenuhnya</li>
              </ul>
            </div>
          </Accordion>

          <Accordion
            title="Pengaturan Payroll"
            icon={<DollarSign className="h-5 w-5 text-green-600" />}
          >
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Menu <strong>Pengaturan → Payroll</strong> — atur komponen gaji:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li><strong>Tarif Lembur:</strong> Rupiah per jam lembur (contoh: Rp 25.000/jam)</li>
                <li><strong>Potongan Terlambat:</strong> Rupiah per menit keterlambatan</li>
                <li><strong>Potongan Absen:</strong> Rupiah per hari tidak hadir tanpa izin</li>
              </ul>
              <InfoBox color="blue">
                Semua perubahan tarif akan berlaku pada perhitungan payroll bulan berikutnya.
              </InfoBox>
            </div>
          </Accordion>

          <Accordion
            title="Payroll (Penggajian Bulanan)"
            icon={<DollarSign className="h-5 w-5 text-purple-600" />}
          >
            <div className="space-y-3">
              <div className="space-y-1">
                <Step number={1} title="Buka Menu 'Payroll'" description="Pilih periode: bulan dan tahun yang ingin dihitung" />
                <WorkflowArrow />
                <Step number={2} title="Review Ringkasan" description="Lihat total gaji, total lembur, dan total potongan" />
                <WorkflowArrow />
                <Step number={3} title="Detail per Karyawan" description="Klik 'Lihat' untuk membuka slip gaji karyawan" />
                <WorkflowArrow />
                <Step number={4} title="Cetak / Simpan" description="Slip gaji bisa dicetak atau disimpan" />
              </div>
              <InfoBox color="green">
                <strong>Formula:</strong> Gaji Pokok + Lembur − Potongan Terlambat − Potongan Absen = <strong>Take Home Pay</strong>
              </InfoBox>
            </div>
          </Accordion>

          <Accordion
            title="Cetak Kartu QR Karyawan"
            icon={<Printer className="h-5 w-5 text-muted-foreground" />}
          >
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Menu <strong>"Cetak QR"</strong> — cetak kartu identitas absensi:</p>
              <div className="space-y-1">
                <Step number={1} title="Buka Menu 'Cetak QR'" description="" />
                <WorkflowArrow />
                <Step number={2} title="Preview Kartu" description="Semua karyawan aktif ditampilkan beserta QR code-nya" />
                <WorkflowArrow />
                <Step number={3} title="Cetak" description="Klik 'Cetak Semua' — kartu berisi nama, posisi, dan QR unik tiap karyawan" />
              </div>
            </div>
          </Accordion>

          <Accordion
            title="Audit Log"
            icon={<ScrollText className="h-5 w-5 text-muted-foreground" />}
          >
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Menu <strong>"Audit Log"</strong> — rekam jejak semua perubahan data sistem:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li><strong>Siapa</strong> yang melakukan perubahan</li>
                <li><strong>Apa</strong> yang diubah (Buat/Ubah/Koreksi/Sistem)</li>
                <li><strong>Detail</strong> data sebelum dan sesudah perubahan</li>
                <li>Filter berdasarkan jenis aksi atau kata kunci</li>
              </ul>
            </div>
          </Accordion>
        </>
      )}

      {/* ===================== SUPER ADMIN / OWNER ===================== */}
      {showSuperAdmin && (
        <>
          <SectionLabel
            badge={<Badge className="bg-red-100 text-red-700">Owner</Badge>}
            label="Fitur Khusus Owner (Super Admin)"
          />

          <Accordion
            title="Owner Dashboard — Ringkasan Semua Perusahaan"
            icon={<Briefcase className="h-5 w-5 text-red-600" />}
            defaultOpen={userRole === 'SUPER_ADMIN'}
          >
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Sebagai Owner, Anda punya <strong>Owner Dashboard</strong> yang memberikan pandangan menyeluruh semua bisnis Anda:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                <li>Daftar semua perusahaan yang Anda kelola</li>
                <li>Statistik per perusahaan: jumlah karyawan, kehadiran hari ini, keterlambatan</li>
                <li>Tombol <strong>"Masuk"</strong> untuk beralih ke perusahaan tertentu</li>
                <li>Notifikasi penting dari semua perusahaan</li>
              </ul>
              <InfoBox color="blue">
                Akses via menu <strong>"Owner Dashboard"</strong> di bagian atas sidebar. Gunakan untuk monitoring harian tanpa harus masuk ke setiap perusahaan satu per satu.
              </InfoBox>
            </div>
          </Accordion>

          <Accordion
            title="Monitor Absensi Semua Karyawan"
            icon={<BarChart3 className="h-5 w-5 text-red-600" />}
          >
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Menu <strong>"Data Absensi"</strong> di Owner Dashboard — monitor kehadiran seluruh tim:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                <li>Filter berdasarkan tanggal, nama karyawan, status (Hadir/Terlambat/Absen/Cuti)</li>
                <li>Lihat detail setiap record: jam check-in, check-out, durasi, metode absensi</li>
                <li>Export data ke format laporan</li>
                <li>Statistik: tingkat kehadiran, persentase tepat waktu, total lembur</li>
              </ul>
              <InfoBox color="green">
                <strong>✅ Ini adalah jawaban untuk "dimana history absensi karyawan"</strong> — buka menu <strong>"Data Absensi"</strong> atau <strong>"Owner Dashboard → Lihat Semua"</strong>.
              </InfoBox>
            </div>
          </Accordion>

          <Accordion
            title="Kelola Multi-Perusahaan"
            icon={<Shield className="h-5 w-5 text-red-600" />}
          >
            <div className="space-y-3">
              <div className="space-y-1">
                <Step number={1} title="Login sebagai Owner" description="Gunakan akun owner (contoh: owner@maulanacorp.com)" />
                <WorkflowArrow />
                <Step number={2} title="Pilih Perusahaan" description="Di Owner Dashboard, pilih perusahaan yang ingin dikelola" />
                <WorkflowArrow />
                <Step number={3} title="Kelola Penuh" description="Semua fitur admin, manager, dan karyawan tersedia untuk Anda" />
                <WorkflowArrow />
                <Step number={4} title="Beralih Perusahaan" description="Klik nama perusahaan di header atau kembali ke Owner Dashboard" />
              </div>
              <InfoBox color="amber">
                Semua tindakan Anda tercatat di <strong>Audit Log</strong> dengan identitas Owner untuk keamanan dan transparansi.
              </InfoBox>
            </div>
          </Accordion>

          <Accordion
            title="Semua Fitur Yang Bisa Diakses Owner"
            icon={<Zap className="h-5 w-5 text-amber-500" />}
          >
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground font-medium">Sebagai Owner, Anda bisa mengakses <strong>semua fitur</strong> di bawah ini:</p>
              <div className="grid grid-cols-1 gap-1.5 text-xs">
                {[
                  { icon: '📊', label: 'Owner Dashboard', desc: 'Ringkasan semua perusahaan' },
                  { icon: '📅', label: 'Data Absensi Karyawan', desc: 'History lengkap semua karyawan' },
                  { icon: '📈', label: 'Analytics & Laporan', desc: 'Grafik & statistik kehadiran' },
                  { icon: '👥', label: 'Manajemen Karyawan', desc: 'Tambah, edit, hapus karyawan' },
                  { icon: '✅', label: 'Approval Cuti & Izin', desc: 'Setujui/tolak pengajuan cuti' },
                  { icon: '⏰', label: 'Approval Lembur', desc: 'Setujui/tolak lembur terencana' },
                  { icon: '✏️', label: 'Approval Koreksi', desc: 'Setujui koreksi data absensi' },
                  { icon: '💰', label: 'Payroll (Penggajian)', desc: 'Hitung & cetak slip gaji' },
                  { icon: '⚙️', label: 'Pengaturan Lengkap', desc: 'Jadwal, lokasi, lembur, payroll, libur' },
                  { icon: '🖨️', label: 'Cetak Kartu QR', desc: 'Kartu absensi digital karyawan' },
                  { icon: '📋', label: 'Audit Log', desc: 'Rekam jejak semua perubahan data' },
                  { icon: '🔄', label: 'Daftar Revisi', desc: 'Tracking perbaikan sistem' },
                  { icon: '🏢', label: 'Kelola Perusahaan', desc: 'Multi-company management' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-muted/40 rounded">
                    <span className="text-base">{item.icon}</span>
                    <div>
                      <p className="font-medium text-xs">{item.label}</p>
                      <p className="text-muted-foreground text-[11px]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Accordion>

          <Accordion
            title="Kelola Perusahaan"
            icon={<Briefcase className="h-5 w-5 text-amber-600" />}
          >
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Menu <strong>"Kelola Perusahaan"</strong>:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Lihat daftar semua perusahaan yang terdaftar</li>
                <li>Tambah perusahaan baru</li>
                <li>Edit informasi perusahaan (nama, alamat, dll)</li>
                <li>Nonaktifkan perusahaan</li>
              </ul>
            </div>
          </Accordion>
        </>
      )}

      {/* ===================== WORKFLOW ===================== */}
      <SectionLabel
        badge={<Badge variant="outline">Alur Kerja</Badge>}
        label="Diagram Alur Sistem"
      />

      <Accordion
        title="Alur Absensi Harian"
        icon={<Clock className="h-5 w-5 text-green-600" />}
      >
        <div className="flex flex-col items-center gap-0.5">
          {[
            { label: 'Karyawan tiba di kantor', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
            { label: 'Buka app → Check-in', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
            { label: 'Validasi GPS (dalam radius?)', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300' },
            { label: 'Scan QR atau Selfie', color: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' },
            { label: 'Status: HADIR atau TERLAMBAT', color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' },
            { label: '— Bekerja —', color: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400' },
            { label: 'Selesai kerja → Check-out', color: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' },
            { label: 'Sistem hitung: Lembur / Pulang Cepat', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
            { label: 'Data tersimpan di riwayat ✅', color: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' },
          ].map((step, i, arr) => (
            <div key={i} className="w-full max-w-xs">
              <div className={`px-4 py-2 rounded-lg text-xs font-medium text-center ${step.color}`}>
                {step.label}
              </div>
              {i < arr.length - 1 && <div className="text-center text-muted-foreground text-sm">↓</div>}
            </div>
          ))}
        </div>
      </Accordion>

      {showManager && (
        <Accordion
          title="Alur Pengajuan & Approval"
          icon={<FileText className="h-5 w-5 text-blue-600" />}
        >
          <div className="flex flex-col items-center gap-0.5">
            {[
              { label: 'Karyawan ajukan: Cuti / Lembur / Koreksi', color: 'bg-blue-100 text-blue-700' },
              { label: 'Status: PENDING', color: 'bg-yellow-100 text-yellow-700' },
              { label: 'Manager/Admin menerima notifikasi', color: 'bg-purple-100 text-purple-700' },
              { label: 'Review detail pengajuan', color: 'bg-purple-100 text-purple-700' },
              { label: 'Keputusan: APPROVED / REJECTED', color: 'bg-amber-100 text-amber-700' },
              { label: 'Karyawan melihat hasil di Pengajuan Saya', color: 'bg-blue-100 text-blue-700' },
              { label: 'Data diupdate otomatis (jika Approved) ✅', color: 'bg-green-100 text-green-700' },
            ].map((step, i, arr) => (
              <div key={i} className="w-full max-w-xs">
                <div className={`px-4 py-2 rounded-lg text-xs font-medium text-center ${step.color}`}>
                  {step.label}
                </div>
                {i < arr.length - 1 && <div className="text-center text-muted-foreground text-sm">↓</div>}
              </div>
            ))}
          </div>
        </Accordion>
      )}

      {showAdmin && (
        <Accordion
          title="Alur Payroll Bulanan"
          icon={<DollarSign className="h-5 w-5 text-green-600" />}
        >
          <div className="flex flex-col items-center gap-0.5">
            {[
              { label: 'Akhir bulan: Admin buka menu Payroll', color: 'bg-amber-100 text-amber-700' },
              { label: 'Pilih periode (bulan & tahun)', color: 'bg-amber-100 text-amber-700' },
              { label: 'Sistem hitung otomatis per karyawan', color: 'bg-blue-100 text-blue-700' },
              { label: 'Gaji Pokok + Lembur − Potongan = Take Home Pay', color: 'bg-purple-100 text-purple-700' },
              { label: 'Admin review & verifikasi', color: 'bg-amber-100 text-amber-700' },
              { label: 'Cetak atau simpan slip gaji ✅', color: 'bg-green-100 text-green-700' },
            ].map((step, i, arr) => (
              <div key={i} className="w-full max-w-xs">
                <div className={`px-4 py-2 rounded-lg text-xs font-medium text-center ${step.color}`}>
                  {step.label}
                </div>
                {i < arr.length - 1 && <div className="text-center text-muted-foreground text-sm">↓</div>}
              </div>
            ))}
          </div>
        </Accordion>
      )}

      {/* Akun Demo - hanya untuk admin ke atas */}
      {showAdmin && (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="p-4">
            <p className="text-sm font-medium mb-3 flex items-center gap-2">
              <Info className="h-4 w-4" /> Akun Demo untuk Testing
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {showSuperAdmin && (
                <div className="p-2 bg-background rounded border">
                  <Badge className="bg-red-100 text-red-700 mb-1 text-[10px]">Owner</Badge>
                  <p className="font-mono text-[11px]">owner@maulanacorp.com</p>
                </div>
              )}
              <div className="p-2 bg-background rounded border">
                <Badge className="bg-amber-100 text-amber-700 mb-1 text-[10px]">Admin</Badge>
                <p className="font-mono text-[11px]">admin@maulanacorp.com</p>
              </div>
              <div className="p-2 bg-background rounded border">
                <Badge className="bg-purple-100 text-purple-700 mb-1 text-[10px]">Manager</Badge>
                <p className="font-mono text-[11px]">manager@maulanacorp.com</p>
              </div>
              <div className="p-2 bg-background rounded border">
                <Badge className="bg-blue-100 text-blue-700 mb-1 text-[10px]">Karyawan</Badge>
                <p className="font-mono text-[11px]">budi@maulanacorp.com</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Password: ketik apa saja (mock authentication)</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
