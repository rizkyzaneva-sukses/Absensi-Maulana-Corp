import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KeyRound, User } from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, updatePassword } = useAuthStore();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password tidak cocok');
      return;
    }

    const updated = updatePassword(newPassword);
    if (updated) {
      setSuccess('Password berhasil diubah!');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setError('Gagal mengubah password');
    }
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profil & Keamanan</h1>
        <p className="text-muted-foreground">Kelola informasi akun dan kata sandi Anda</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User size={18} /> Informasi Akun
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Lengkap</label>
              <Input value={currentUser.full_name} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input value={currentUser.user_email} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Posisi</label>
              <Input value={currentUser.position || '-'} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">ID Karyawan</label>
              <Input value={currentUser.employee_id} disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <KeyRound size={18} /> Ganti Kata Sandi
          </CardTitle>
          <CardDescription>
            Ganti kata sandi akun Anda untuk menjaga keamanan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Kata Sandi Baru</label>
              <Input
                type="password"
                placeholder="Minimal 6 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Konfirmasi Kata Sandi Baru</label>
              <Input
                type="password"
                placeholder="Masukkan ulang kata sandi"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
            {success && <p className="text-sm text-green-500 font-medium">{success}</p>}

            <Button type="submit">
              Simpan Kata Sandi
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
