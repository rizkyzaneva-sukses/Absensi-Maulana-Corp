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
  ScrollText, ListTodo, Printer
} from 'lucide-react';

function Accordion({ title, icon, children, defaultOpen = false }: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium">{title}</span>
        </div>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && <CardContent className="pt-0 pb-4">{children}</CardContent>}
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
    <div className="flex justify-center py-1">
      <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
    </div>
  );
}

/**
 * Role hierarchy: SUPER_ADMIN > COMPANY_ADMIN > MANAGER > KARYAWAN
 * Each role sees their own guide + all lower role guides.
 */
function getRoleLevel(role: string): number {
  switch (role) {
    case 'SUPER_ADMIN': return 4;
    case 'COMPANY_ADMIN': return 3;
    case 'MANAGER': return 2;
    case 'KARYAWAN': return 1;
    default: return 1;
  }
}

function getRoleLabel(role: string): string {
  switch (role) {
    case 'SUPER_ADMIN': return 'Super Admin (Owner)';
    case 'COMPANY_ADMIN': return 'Admin Perusahaan';
    case 'MANAGER': return 'Manager';
    case 'KARYAWAN': return 'Karyawan';
    default: return role;
  }
}

function getRoleBadgeColor(role: string): string {
  switch (role) {
    case 'SUPER_ADMIN': return 'bg-red-100 text-red-700';
    case 'COMPANY_ADMIN': return 'bg-amber-100 text-amber-700';
    case 'MANAGER': return 'bg-purple-100 text-purple-700';
    case 'KARYAWAN': return 'bg-blue-100 text-blue-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

export default function UserGuidePage() {
  const { currentUser } = useAuthStore();
  const userRole = currentUser?.role || 'KARYAWAN';
  const userLevel = getRoleLevel(userRole);

  // Determine which sections to show based on role hierarchy
  const showKaryawan = userLevel >= 1; // Everyone sees this
  const showManager = userLevel >= 2;
  const showAdmin = userLevel >= 3;
  const showSuperAdmin = userLevel >= 4;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Panduan Penggunaan"
        subtitle={`Panduan untuk role: ${getRoleLabel(userRole)}`}
        backTo="/dashboard"
      />

      {/* Current Role Indicator */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">
                Anda login sebagai: <Badge className={getRoleBadgeColor(userRole)}>{getRoleLabel(userRole)}</Badge>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {userLevel === 4 && 'Anda memiliki akses penuh ke semua fitur aplikasi.'}
                {userLevel === 3 && 'Anda dapat mengelola karyawan, pengaturan, payroll, dan approval.'}
                {userLevel === 2 && 'Anda dapat melakukan approval dan memonitor tim Anda.'}
                {userLevel === 1 && 'Anda dapat melakukan absensi dan mengajukan cuti/lembur/koreksi.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ==================== OVERVIEW (ALL ROLES) ==================== */}
      <Accordion
        title="Gambaran Umum Aplikasi"
        icon={<BookOpen className="h-5 w-5 text-primary" />}
        defaultOpen={true}
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Aplikasi Absensi Maulana Corp adalah sistem manajemen kehadiran karyawan yang mencakup:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Absensi Digital</p>
                <p className="text-xs text-muted-foreground">Check-in/out dengan GPS & selfie/QR</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <FileText className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Pengajuan & Approval</p>
                <p className="text-xs text-muted-foreground">Cuti, lembur, koreksi absensi</p>
              </div>
            </div>
            {showAdmin && (
              <div className="flex items-start gap-2 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <DollarSign className="h-4 w-4 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Payroll</p>
                  <p className="text-xs text-muted-foreground">Perhitungan gaji otomatis</p>
                </div>
              </div>
            )}
            {showManager && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                <BarChart3 className="h-4 w-4 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Analytics & Laporan</p>
                  <p className="text-xs text-muted-foreground">Dashboard & statistik kehadiran</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Hierarki Role:</p>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Badge className="bg-red-100 text-red-700">Super Admin (Owner)</Badge>
              <ArrowRight className="h-3 w-3" />
              <Badge className="bg-amber-100 text-amber-700">Company Admin</Badge>
              <ArrowRight className="h-3 w-3" />
              <Badge className="bg-purple-100 text-purple-700">Manager</Badge>
              <ArrowRight className="h-3 w-3" />
              <Badge className="bg-blue-100 text-blue-700">Karyawan</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Role Anda saat ini: <strong>{getRoleLabel(userRole)}</strong> — Anda dapat mengakses semua fitur di bawah level Anda.
            </p>
          </div>
        </div>
      </Accordion>

      {/* ==================== KARYAWAN GUIDE ==================== */}
      {showKaryawan && (
        <>
          <div className="flex items-center gap-2 pt-2">
            <Badge className="bg-blue-100 text-blue-700">Karyawan</Badge>
            <span className="text-sm font-medium">
              {userRole === 'KARYAWAN' ? 'Fitur Anda' : 'Fitur Karyawan (juga berlaku untuk Anda)'}
            </span>
          </div>

          <Accordion
            title="Check-in (Absen Masuk)"
            icon={<LogIn className="h-5 w-5 text-green-600" />}
            defaultOpen={userRole === 'KARYAWAN'}
          >
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Proses check-in dilakukan setiap hari kerja saat tiba di kantor.
              </p>
              <div className="space-y-1">
                <Step number={1} title="Buka halaman Check-in" description="Klik menu 'Check-in' di sidebar atau tombol Check-in di dashboard" />
                <WorkflowArrow />
                <Step number={2} title="Validasi Lokasi GPS" description="Sistem akan mengecek apakah Anda berada dalam radius kantor. Klik 'Cek Lokasi Saya' dan izinkan akses GPS." />
                <WorkflowArrow />
                <Step number={3} title="Pilih Metode Absensi" description="Pilih antara Scan QR Code atau Selfie sebagai bukti kehadiran." />
                <WorkflowArrow />
                <Step number={4} title="Konfirmasi" description="Review data check-in (waktu, lokasi, metode) lalu klik 'Konfirmasi Check-in'." />
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg">
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  <AlertTriangle className="h-3 w-3 inline mr-1" />
                  <strong>Catatan:</strong> Jika check-in setelah jam 08:00, status akan otomatis menjadi "Terlambat". Toleransi keterlambatan dapat diatur oleh admin.
                </p>
              </div>
            </div>
          </Accordion>

          <Accordion
            title="Check-out (Absen Pulang)"
            icon={<LogOut className="h-5 w-5 text-red-500" />}
          >
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Check-out dilakukan saat selesai bekerja.
              </p>
              <div className="space-y-1">
                <Step number={1} title="Buka halaman Check-out" description="Klik menu 'Check-out' di sidebar" />
                <WorkflowArrow />
                <Step number={2} title="Review Informasi" description="Lihat jam check-in, durasi kerja, dan status (pulang cepat/lembur)" />
                <WorkflowArrow />
                <Step number={3} title="Selfie (opsional)" description="Ambil foto selfie sebagai bukti check-out" />
                <WorkflowArrow />
                <Step number={4} title="Konfirmasi Check-out" description="Jika pulang lebih awal, isi alasan. Lalu klik konfirmasi." />
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg text-xs text-blue-700 dark:text-blue-300">
                <strong>Info:</strong> Jika check-out setelah jam kerja berakhir, sistem akan menghitung lembur otomatis (jika fitur lembur aktif).
              </div>
            </div>
          </Accordion>

          <Accordion
            title="Pengajuan Cuti / Izin / Sakit"
            icon={<Calendar className="h-5 w-5 text-blue-500" />}
          >
            <div className="space-y-3">
              <div className="space-y-1">
                <Step number={1} title="Buka Pengajuan Saya" description="Menu 'Pengajuan Saya' → klik 'Ajukan Cuti/Izin'" />
                <WorkflowArrow />
                <Step number={2} title="Isi Form" description="Pilih jenis (Cuti/Izin/Sakit), tanggal mulai & selesai, dan alasan" />
                <WorkflowArrow />
                <Step number={3} title="Kirim Pengajuan" description="Klik 'Ajukan' — pengajuan akan dikirim ke Manager/Admin untuk disetujui" />
                <WorkflowArrow />
                <Step number={4} title="Tunggu Persetujuan" description="Status pengajuan bisa dilihat di halaman 'Pengajuan Saya'" />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded">
                  <p className="font-medium text-yellow-700">PENDING</p>
                  <p className="text-muted-foreground">Menunggu</p>
                </div>
                <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded">
                  <p className="font-medium text-green-700">APPROVED</p>
                  <p className="text-muted-foreground">Disetujui</p>
                </div>
                <div className="p-2 bg-red-50 dark:bg-red-950/20 rounded">
                  <p className="font-medium text-red-700">REJECTED</p>
                  <p className="text-muted-foreground">Ditolak</p>
                </div>
              </div>
            </div>
          </Accordion>

          <Accordion
            title="Pengajuan Lembur"
            icon={<Clock className="h-5 w-5 text-purple-500" />}
          >
            <div className="space-y-3">
              <div className="space-y-1">
                <Step number={1} title="Buka Form Lembur" description="Menu 'Pengajuan Saya' → 'Ajukan Lembur'" />
                <WorkflowArrow />
                <Step number={2} title="Isi Detail" description="Pilih tanggal, jam mulai & selesai lembur, dan alasan" />
                <WorkflowArrow />
                <Step number={3} title="Kirim" description="Pengajuan dikirim ke Manager/Admin" />
              </div>
              <div className="bg-muted/50 p-3 rounded-lg text-xs">
                <strong>Perhitungan Lembur:</strong> Jam lembur × Tarif per jam (default Rp 25.000/jam). Tarif dapat diubah oleh admin.
              </div>
            </div>
          </Accordion>

          <Accordion
            title="Koreksi Absensi"
            icon={<FileText className="h-5 w-5 text-amber-500" />}
          >
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Jika ada kesalahan data absensi (lupa check-in/out, waktu salah), ajukan koreksi.
              </p>
              <div className="space-y-1">
                <Step number={1} title="Buka Form Koreksi" description="Menu 'Pengajuan Saya' → 'Ajukan Koreksi'" />
                <WorkflowArrow />
                <Step number={2} title="Pilih Tanggal" description="Pilih tanggal absensi yang ingin dikoreksi" />
                <WorkflowArrow />
                <Step number={3} title="Isi Waktu Koreksi" description="Masukkan jam check-in dan/atau check-out yang benar" />
                <WorkflowArrow />
                <Step number={4} title="Isi Alasan" description="Jelaskan alasan koreksi, lalu kirim" />
              </div>
            </div>
          </Accordion>

          <Accordion
            title="Riwayat Absensi"
            icon={<ScrollText className="h-5 w-5 text-gray-500" />}
          >
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Lihat riwayat absensi Anda di menu <strong>"Riwayat Saya"</strong>:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Filter berdasarkan bulan</li>
                <li>Lihat detail setiap hari (jam masuk, jam keluar, status)</li>
                <li>Ringkasan bulanan (total hadir, terlambat, izin, dll)</li>
              </ul>
            </div>
          </Accordion>
        </>
      )}

      {/* ==================== MANAGER GUIDE ==================== */}
      {showManager && (
        <>
          <div className="flex items-center gap-2 pt-4 border-t">
            <Badge className="bg-purple-100 text-purple-700">Manager</Badge>
            <span className="text-sm font-medium">
              {userRole === 'MANAGER' ? 'Fitur Khusus Manager' : 'Fitur Manager'}
            </span>
          </div>

          <Accordion
            title="Dashboard Manager"
            icon={<BarChart3 className="h-5 w-5 text-purple-600" />}
            defaultOpen={userRole === 'MANAGER'}
          >
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Dashboard Manager menampilkan ringkasan harian tim Anda:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li><strong>Statistik Hari Ini:</strong> Jumlah hadir, terlambat, belum absen, izin/cuti</li>
                <li><strong>Menunggu Persetujuan:</strong> Jumlah pengajuan cuti, lembur, koreksi yang pending</li>
                <li><strong>Daftar Terlambat:</strong> Karyawan yang terlambat hari ini</li>
                <li><strong>Belum Check-in:</strong> Karyawan yang belum absen</li>
                <li><strong>Tabel Absensi:</strong> Detail absensi semua karyawan hari ini</li>
              </ul>
              <p className="text-xs">Akses via menu <strong>"Manager"</strong> di sidebar.</p>
            </div>
          </Accordion>

          <Accordion
            title="Approval Cuti / Izin"
            icon={<CheckCircle className="h-5 w-5 text-green-600" />}
          >
            <div className="space-y-3">
              <div className="space-y-1">
                <Step number={1} title="Buka Approval Cuti" description="Menu 'Approval Cuti' di sidebar" />
                <WorkflowArrow />
                <Step number={2} title="Review Pengajuan" description="Lihat detail pengajuan: nama karyawan, jenis cuti, tanggal, alasan" />
                <WorkflowArrow />
                <Step number={3} title="Setujui atau Tolak" description="Klik ✓ untuk setujui atau ✗ untuk tolak (dengan alasan penolakan)" />
              </div>
              <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg text-xs text-green-700 dark:text-green-300">
                <strong>Tips:</strong> Pengajuan yang sudah diproses akan pindah ke tab "Sudah Diproses" untuk referensi.
              </div>
            </div>
          </Accordion>

          <Accordion
            title="Approval Lembur"
            icon={<Clock className="h-5 w-5 text-blue-600" />}
          >
            <div className="space-y-3">
              <div className="space-y-1">
                <Step number={1} title="Buka Approval Lembur" description="Menu 'Approval Lembur' di sidebar" />
                <WorkflowArrow />
                <Step number={2} title="Review Detail" description="Periksa tanggal, jam mulai/selesai, dan alasan lembur" />
                <WorkflowArrow />
                <Step number={3} title="Proses" description="Setujui jika valid, atau tolak dengan alasan" />
              </div>
              <div className="bg-muted/50 p-3 rounded-lg text-xs">
                <strong>Catatan:</strong> Lembur yang disetujui akan masuk ke perhitungan payroll bulan berjalan.
              </div>
            </div>
          </Accordion>

          <Accordion
            title="Approval Koreksi Absensi"
            icon={<FileText className="h-5 w-5 text-amber-600" />}
          >
            <div className="space-y-3">
              <div className="space-y-1">
                <Step number={1} title="Buka Approval Koreksi" description="Menu 'Approval Koreksi' di sidebar" />
                <WorkflowArrow />
                <Step number={2} title="Lihat Perbandingan" description="Klik ikon mata untuk melihat waktu asli vs waktu koreksi yang diajukan" />
                <WorkflowArrow />
                <Step number={3} title="Proses" description="Setujui (data absensi akan diupdate otomatis) atau tolak dengan alasan" />
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg text-xs text-amber-700 dark:text-amber-300">
                <AlertTriangle className="h-3 w-3 inline mr-1" />
                <strong>Penting:</strong> Saat koreksi disetujui, data absensi karyawan akan otomatis diperbarui. Pastikan data koreksi sudah benar sebelum menyetujui.
              </div>
            </div>
          </Accordion>

          <Accordion
            title="Analytics Tim"
            icon={<BarChart3 className="h-5 w-5 text-amber-600" />}
          >
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Menu <strong>"Analytics"</strong> menampilkan statistik tim Anda:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Grafik kehadiran mingguan</li>
                <li>Tren keterlambatan</li>
                <li>Ranking kehadiran karyawan</li>
                <li>Ringkasan lembur dan cuti</li>
              </ul>
            </div>
          </Accordion>
        </>
      )}

      {/* ==================== COMPANY ADMIN GUIDE ==================== */}
      {showAdmin && (
        <>
          <div className="flex items-center gap-2 pt-4 border-t">
            <Badge className="bg-amber-100 text-amber-700">Company Admin</Badge>
            <span className="text-sm font-medium">
              {userRole === 'COMPANY_ADMIN' ? 'Fitur Khusus Admin' : 'Fitur Admin Perusahaan'}
            </span>
          </div>

          <Accordion
            title="Kelola Karyawan"
            icon={<Users className="h-5 w-5 text-blue-600" />}
            defaultOpen={userRole === 'COMPANY_ADMIN'}
          >
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Menu <strong>"Karyawan"</strong> untuk mengelola data karyawan perusahaan:
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded">
                  <Badge variant="outline" className="text-xs shrink-0">Tambah</Badge>
                  <span>Klik tombol "Tambah Karyawan" → isi form lengkap (nama, ID karyawan, email, telepon, posisi, departemen, role, tanggal bergabung, gaji) → klik Simpan</span>
                </div>
                <div className="flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                  <Badge variant="outline" className="text-xs shrink-0">Edit</Badge>
                  <span>Klik ikon pensil (✏️) pada kartu karyawan → ubah data yang diperlukan → klik Simpan Perubahan</span>
                </div>
                <div className="flex items-start gap-2 p-2 bg-purple-50 dark:bg-purple-950/20 rounded">
                  <Badge variant="outline" className="text-xs shrink-0">Detail</Badge>
                  <span>Klik ikon mata (👁️) untuk melihat informasi lengkap karyawan termasuk gaji dan status</span>
                </div>
                <div className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-950/20 rounded">
                  <Badge variant="outline" className="text-xs shrink-0">Hapus</Badge>
                  <span>Klik ikon tempat sampah (🗑️) → konfirmasi penghapusan di dialog yang muncul</span>
                </div>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg text-xs">
                <strong>Tips:</strong> Gunakan kolom pencarian untuk mencari karyawan berdasarkan nama, posisi, atau ID karyawan.
              </div>
            </div>
          </Accordion>

          <Accordion
            title="Pengaturan Hari Libur"
            icon={<Calendar className="h-5 w-5 text-red-500" />}
          >
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Menu <strong>Pengaturan → Hari Libur</strong>:</p>
              <div className="space-y-1">
                <Step number={1} title="Buka Pengaturan" description="Klik menu 'Pengaturan' di sidebar" />
                <WorkflowArrow />
                <Step number={2} title="Pilih tab Hari Libur" description="Atau langsung ke /settings/holidays" />
                <WorkflowArrow />
                <Step number={3} title="Tambah Hari Libur" description="Klik 'Tambah' → isi nama libur dan tanggal → simpan" />
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg text-xs text-blue-700 dark:text-blue-300">
                <strong>Info:</strong> Hari libur akan otomatis dikecualikan dari perhitungan kehadiran dan payroll.
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
                <Step number={1} title="Tambah Lokasi" description="Klik 'Tambah Lokasi' → isi nama lokasi" />
                <WorkflowArrow />
                <Step number={2} title="Isi Koordinat GPS" description="Masukkan latitude dan longitude kantor (bisa dari Google Maps)" />
                <WorkflowArrow />
                <Step number={3} title="Atur Radius" description="Tentukan radius toleransi dalam meter (contoh: 100m)" />
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg text-xs text-amber-700 dark:text-amber-300">
                <AlertTriangle className="h-3 w-3 inline mr-1" />
                <strong>Penting:</strong> Karyawan hanya bisa check-in jika berada dalam radius yang ditentukan. Pastikan radius cukup luas untuk mengakomodasi area parkir/lobby.
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
                <Step number={2} title="Atur Jam Kerja" description="Tentukan jam masuk & pulang untuk setiap hari (Senin-Minggu)" />
                <WorkflowArrow />
                <Step number={3} title="Tandai Hari Kerja" description="Centang hari-hari yang merupakan hari kerja" />
                <WorkflowArrow />
                <Step number={4} title="Assign ke Karyawan" description="Jadwal akan berlaku untuk karyawan yang di-assign" />
              </div>
            </div>
          </Accordion>

          <Accordion
            title="Pengaturan Lembur"
            icon={<Settings className="h-5 w-5 text-purple-600" />}
          >
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Menu <strong>Pengaturan → Lembur</strong>:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li><strong>Toleransi Keterlambatan:</strong> Berapa menit sebelum dianggap terlambat (default: 15 menit)</li>
                <li><strong>Maks Jam Lembur:</strong> Batas maksimal jam lembur per hari (default: 4 jam)</li>
              </ul>
            </div>
          </Accordion>

          <Accordion
            title="Pengaturan Payroll"
            icon={<DollarSign className="h-5 w-5 text-green-600" />}
          >
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Menu <strong>Pengaturan → Payroll</strong>:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li><strong>Tarif Lembur:</strong> Rupiah per jam lembur</li>
                <li><strong>Potongan Terlambat:</strong> Potongan per menit keterlambatan</li>
                <li><strong>Potongan Absen:</strong> Potongan per hari tidak hadir tanpa izin</li>
              </ul>
            </div>
          </Accordion>

          <Accordion
            title="Payroll (Penggajian)"
            icon={<DollarSign className="h-5 w-5 text-purple-600" />}
          >
            <div className="space-y-3">
              <div className="space-y-1">
                <Step number={1} title="Buka Payroll" description="Menu 'Payroll' di sidebar" />
                <WorkflowArrow />
                <Step number={2} title="Pilih Periode" description="Pilih bulan dan tahun penggajian" />
                <WorkflowArrow />
                <Step number={3} title="Review Data" description="Lihat ringkasan: total gaji, total lembur, total potongan" />
                <WorkflowArrow />
                <Step number={4} title="Lihat Slip Gaji" description="Klik 'Lihat' pada karyawan untuk melihat detail slip gaji" />
              </div>
              <div className="bg-muted/50 p-3 rounded-lg text-xs">
                <strong>Komponen Gaji:</strong> Gaji Pokok + Uang Lembur - Potongan Terlambat - Potongan Absen = Take Home Pay
              </div>
            </div>
          </Accordion>

          <Accordion
            title="Cetak Kartu QR"
            icon={<Printer className="h-5 w-5 text-gray-600" />}
          >
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Menu <strong>"Cetak QR"</strong>:</p>
              <div className="space-y-1">
                <Step number={1} title="Buka Cetak QR" description="Menu 'Cetak QR' di sidebar" />
                <WorkflowArrow />
                <Step number={2} title="Lihat Preview" description="Kartu QR semua karyawan aktif ditampilkan" />
                <WorkflowArrow />
                <Step number={3} title="Cetak" description="Klik 'Cetak Semua' untuk mencetak kartu QR" />
              </div>
              <div className="text-xs text-muted-foreground">
                Setiap kartu berisi: Nama, Posisi, ID Karyawan, dan QR Code unik untuk absensi.
              </div>
            </div>
          </Accordion>

          <Accordion
            title="Audit Log"
            icon={<ScrollText className="h-5 w-5 text-gray-600" />}
          >
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Menu <strong>"Audit Log"</strong> mencatat semua perubahan data sistem:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li><strong>Siapa:</strong> User yang melakukan perubahan</li>
                <li><strong>Apa:</strong> Jenis aksi (Buat, Ubah, Koreksi, Sistem)</li>
                <li><strong>Detail:</strong> Data sebelum dan sesudah perubahan</li>
                <li><strong>Filter:</strong> Cari berdasarkan jenis aksi atau kata kunci</li>
              </ul>
            </div>
          </Accordion>

          <Accordion
            title="Daftar Revisi"
            icon={<ListTodo className="h-5 w-5 text-blue-600" />}
          >
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Menu <strong>"Revisi"</strong> untuk tracking perbaikan sistem:</p>
              <div className="space-y-1">
                <Step number={1} title="Buat Revisi Baru" description="Klik 'Tambah Revisi' → isi judul dan deskripsi" />
                <WorkflowArrow />
                <Step number={2} title="Atur Prioritas & Deadline" description="Pilih prioritas (Rendah/Sedang/Tinggi) dan tenggat waktu" />
                <WorkflowArrow />
                <Step number={3} title="Update Status" description="Ubah status: Menunggu → Dikerjakan → Selesai" />
              </div>
            </div>
          </Accordion>
        </>
      )}

      {/* ==================== SUPER ADMIN GUIDE ==================== */}
      {showSuperAdmin && (
        <>
          <div className="flex items-center gap-2 pt-4 border-t">
            <Badge className="bg-red-100 text-red-700">Super Admin</Badge>
            <span className="text-sm font-medium">Fitur Khusus Super Admin (Owner)</span>
          </div>

          <Accordion
            title="Owner Dashboard"
            icon={<Briefcase className="h-5 w-5 text-red-600" />}
            defaultOpen={userRole === 'SUPER_ADMIN'}
          >
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Sebagai Super Admin, Anda memiliki akses ke <strong>Owner Dashboard</strong> yang menampilkan:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Daftar semua perusahaan yang Anda kelola</li>
                <li>Statistik ringkasan per perusahaan (jumlah karyawan, kehadiran hari ini)</li>
                <li>Tombol "Masuk" untuk beralih ke perusahaan tertentu</li>
              </ul>
              <p className="text-xs">Akses via menu <strong>"Owner Dashboard"</strong> di bagian atas sidebar.</p>
            </div>
          </Accordion>

          <Accordion
            title="Multi-Company Management"
            icon={<Shield className="h-5 w-5 text-red-600" />}
          >
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Super Admin dapat mengelola beberapa perusahaan sekaligus:
              </p>
              <div className="space-y-1">
                <Step number={1} title="Login sebagai Super Admin" description="Gunakan email owner (contoh: owner@maulanacorp.com)" />
                <WorkflowArrow />
                <Step number={2} title="Pilih Perusahaan" description="Setelah login, pilih perusahaan yang ingin dikelola dari daftar" />
                <WorkflowArrow />
                <Step number={3} title="Kelola Perusahaan" description="Semua fitur admin tersedia untuk perusahaan yang dipilih" />
                <WorkflowArrow />
                <Step number={4} title="Beralih Perusahaan" description="Klik nama perusahaan di header atau kembali ke Owner Dashboard" />
              </div>
              <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg text-xs text-red-700 dark:text-red-300">
                <strong>Catatan:</strong> Semua perubahan yang Anda lakukan akan tercatat di Audit Log dengan identitas Super Admin.
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
                <li>Lihat daftar semua perusahaan</li>
                <li>Tambah perusahaan baru</li>
                <li>Edit informasi perusahaan (nama, alamat, dll)</li>
                <li>Nonaktifkan perusahaan</li>
              </ul>
            </div>
          </Accordion>
        </>
      )}

      {/* ==================== WORKFLOW DIAGRAMS ==================== */}
      <div className="flex items-center gap-2 pt-4 border-t">
        <Badge variant="outline">Workflow</Badge>
        <span className="text-sm font-medium">Alur Kerja Sistem</span>
      </div>

      {/* Attendance workflow - shown to all */}
      <Accordion
        title="Workflow Absensi Harian"
        icon={<Clock className="h-5 w-5 text-green-600" />}
      >
        <div className="space-y-2">
          <div className="flex flex-col items-center gap-1">
            {[
              { label: 'Karyawan tiba di kantor', color: 'bg-blue-100 text-blue-700' },
              { label: 'Buka app → Check-in', color: 'bg-blue-100 text-blue-700' },
              { label: 'Validasi GPS (dalam radius?)', color: 'bg-yellow-100 text-yellow-700' },
              { label: 'Pilih metode: QR / Selfie', color: 'bg-purple-100 text-purple-700' },
              { label: 'Konfirmasi → Status: HADIR / TERLAMBAT', color: 'bg-green-100 text-green-700' },
              { label: '... Bekerja ...', color: 'bg-gray-100 text-gray-500' },
              { label: 'Selesai kerja → Check-out', color: 'bg-red-100 text-red-700' },
              { label: 'Hitung: Lembur / Pulang Cepat', color: 'bg-amber-100 text-amber-700' },
              { label: 'Data tersimpan di riwayat', color: 'bg-green-100 text-green-700' },
            ].map((step, i) => (
              <div key={i}>
                <div className={`px-4 py-2 rounded-lg text-xs font-medium text-center ${step.color}`}>
                  {step.label}
                </div>
                {i < 8 && <div className="text-center text-muted-foreground">↓</div>}
              </div>
            ))}
          </div>
        </div>
      </Accordion>

      {/* Approval workflow - shown to Manager+ */}
      {showManager && (
        <Accordion
          title="Workflow Pengajuan & Approval"
          icon={<FileText className="h-5 w-5 text-blue-600" />}
        >
          <div className="space-y-2">
            <div className="flex flex-col items-center gap-1">
              {[
                { label: 'Karyawan mengajukan (Cuti/Lembur/Koreksi)', color: 'bg-blue-100 text-blue-700' },
                { label: 'Status: PENDING', color: 'bg-yellow-100 text-yellow-700' },
                { label: 'Manager/Admin menerima notifikasi', color: 'bg-purple-100 text-purple-700' },
                { label: 'Review detail pengajuan', color: 'bg-purple-100 text-purple-700' },
                { label: 'Keputusan: APPROVED / REJECTED', color: 'bg-amber-100 text-amber-700' },
                { label: 'Karyawan menerima notifikasi hasil', color: 'bg-blue-100 text-blue-700' },
                { label: 'Data diupdate otomatis (jika approved)', color: 'bg-green-100 text-green-700' },
              ].map((step, i) => (
                <div key={i}>
                  <div className={`px-4 py-2 rounded-lg text-xs font-medium text-center ${step.color}`}>
                    {step.label}
                  </div>
                  {i < 6 && <div className="text-center text-muted-foreground">↓</div>}
                </div>
              ))}
            </div>
          </div>
        </Accordion>
      )}

      {/* Payroll workflow - shown to Admin+ */}
      {showAdmin && (
        <Accordion
          title="Workflow Payroll Bulanan"
          icon={<DollarSign className="h-5 w-5 text-green-600" />}
        >
          <div className="space-y-2">
            <div className="flex flex-col items-center gap-1">
              {[
                { label: 'Akhir bulan: Admin buka menu Payroll', color: 'bg-amber-100 text-amber-700' },
                { label: 'Pilih periode (bulan/tahun)', color: 'bg-amber-100 text-amber-700' },
                { label: 'Sistem hitung otomatis per karyawan:', color: 'bg-blue-100 text-blue-700' },
                { label: 'Gaji Pokok + Lembur - Potongan Terlambat - Potongan Absen', color: 'bg-purple-100 text-purple-700' },
                { label: 'Admin review & verifikasi', color: 'bg-amber-100 text-amber-700' },
                { label: 'Cetak slip gaji', color: 'bg-green-100 text-green-700' },
              ].map((step, i) => (
                <div key={i}>
                  <div className={`px-4 py-2 rounded-lg text-xs font-medium text-center ${step.color}`}>
                    {step.label}
                  </div>
                  {i < 5 && <div className="text-center text-muted-foreground">↓</div>}
                </div>
              ))}
            </div>
          </div>
        </Accordion>
      )}

      {/* Demo Login Info - only for admin/super admin */}
      {showAdmin && (
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <p className="text-sm font-medium mb-2">🔑 Akun Demo untuk Testing:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {showSuperAdmin && (
                <div className="p-2 bg-background rounded">
                  <Badge className="bg-red-100 text-red-700 mb-1">Super Admin</Badge>
                  <p className="font-mono">owner@maulanacorp.com</p>
                </div>
              )}
              <div className="p-2 bg-background rounded">
                <Badge className="bg-amber-100 text-amber-700 mb-1">Company Admin</Badge>
                <p className="font-mono">admin@maulanacorp.com</p>
              </div>
              <div className="p-2 bg-background rounded">
                <Badge className="bg-purple-100 text-purple-700 mb-1">Manager</Badge>
                <p className="font-mono">manager@maulanacorp.com</p>
              </div>
              <div className="p-2 bg-background rounded">
                <Badge className="bg-blue-100 text-blue-700 mb-1">Karyawan</Badge>
                <p className="font-mono">budi@maulanacorp.com</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Password: ketik apa saja (mock authentication)</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
