import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useDataStore } from '@/stores/dataStore';
import { apiHeaders } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KeyRound, User, Send, CheckCircle2, ExternalLink, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, updatePassword } = useAuthStore();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Telegram connect state
  const [tgLoading, setTgLoading] = useState(false);
  const [tgLink, setTgLink] = useState('');
  const [tgToken, setTgToken] = useState('');
  const [tgPolling, setTgPolling] = useState(false);
  const [tgConnected, setTgConnected] = useState(false);

  const isTelegramConnected = !!currentUser?.telegram_chat_id;

  const handleConnectTelegram = async () => {
    if (!currentUser) return;
    setTgLoading(true);
    setError('');
    try {
      const res = await fetch('/api/telegram/connect', {
        method: 'POST',
        headers: apiHeaders(),
        body: JSON.stringify({ employee_id: currentUser.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal membuat link koneksi.');
      setTgLink(data.telegram_link);
      setTgToken(data.token);
      setTgPolling(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghubungkan Telegram.');
    } finally {
      setTgLoading(false);
    }
  };

  // Poll connection status
  const pollStatus = useCallback(async () => {
    if (!tgToken || !currentUser) return;
    try {
      const res = await fetch(`/api/telegram/connect-status?token=${tgToken}`, { headers: apiHeaders() });
      const data = await res.json();
      if (data.connected) {
        setTgConnected(true);
        setTgPolling(false);
        useDataStore.getState().updateEmployee(currentUser.id, { telegram_chat_id: data.chat_id });
        useAuthStore.setState({ currentUser: { ...currentUser, telegram_chat_id: data.chat_id } });
      }
    } catch {
      // ignore polling errors
    }
  }, [tgToken, currentUser]);

  useEffect(() => {
    if (!tgPolling) return;
    const interval = setInterval(pollStatus, 2000);
    return () => clearInterval(interval);
  }, [tgPolling, pollStatus]);

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

      {/* Telegram Connect Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Send size={18} /> Telegram
          </CardTitle>
          <CardDescription>
            {isTelegramConnected
              ? 'Akun Anda sudah terhubung dengan Telegram. Kode reset password akan dikirim ke sini.'
              : 'Hubungkan akun Anda dengan Telegram untuk menerima kode reset password.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isTelegramConnected ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 size={18} />
              <span className="font-medium">Terkoneksi</span>
            </div>
          ) : tgConnected ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 size={18} />
              <span className="font-medium">Berhasil terhubung!</span>
            </div>
          ) : tgLink ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Klik link di bawah ini, lalu tekan <strong>Start</strong> di Telegram:
              </p>
              <a
                href={tgLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                <Send size={14} />
                Buka Telegram
                <ExternalLink size={12} />
              </a>
              {tgPolling && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 size={14} className="animate-spin" />
                  Menunggu konfirmasi dari Telegram...
                </div>
              )}
            </div>
          ) : (
            <Button onClick={handleConnectTelegram} disabled={tgLoading}>
              {tgLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  Memproses...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send size={14} />
                  Connect Telegram
                </span>
              )}
            </Button>
          )}
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
