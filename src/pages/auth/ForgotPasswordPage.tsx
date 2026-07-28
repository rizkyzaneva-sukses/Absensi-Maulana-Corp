import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, findEmployeeByEmail } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Building2, Eye, EyeOff, Send } from 'lucide-react';

type Step = 'email' | 'reset';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const resetPasswordWithEmail = useAuthStore((state) => state.resetPasswordWithEmail);
  const navigate = useNavigate();

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const employee = findEmployeeByEmail(email.trim().toLowerCase());
      if (!employee) {
        throw new Error('Email tidak terdaftar di sistem.');
      }
      if (!employee.telegram_chat_id) {
        throw new Error('Akun Anda belum terhubung dengan Telegram. Hubungi admin untuk menghubungkan.');
      }

      const response = await fetch('/api/auth/password-reset/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          telegram_chat_id: employee.telegram_chat_id,
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || 'Gagal mengirim kode verifikasi.');
      }
      setInfo(result?.message || 'Kode verifikasi telah dikirim ke Telegram Anda.');
      setStep('reset');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengirim kode verifikasi.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password baru minimal 6 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/password-reset/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code: code.trim() }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || 'Kode verifikasi tidak valid.');
      }

      const applied = resetPasswordWithEmail(email.trim().toLowerCase(), newPassword);
      if (!applied) {
        throw new Error('Email tidak terdaftar pada perangkat ini.');
      }

      navigate('/login', { state: { passwordResetSuccess: true } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mereset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Maulana Corp</h1>
          <p className="text-muted-foreground mt-1">Reset Password</p>
        </div>

        <Card>
          {step === 'email' ? (
            <>
              <CardHeader>
                <CardTitle className="text-xl">Lupa Password</CardTitle>
                <CardDescription>Masukkan email akun Anda, kami akan mengirimkan kode verifikasi via Telegram.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRequestCode} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      placeholder="email@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Mengirim...' : (
                      <span className="flex items-center gap-2">
                        <Send size={16} />
                        Kirim Kode via Telegram
                      </span>
                    )}
                  </Button>
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft size={14} />
                    Kembali ke halaman masuk
                  </Link>
                </form>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle className="text-xl">Masukkan Kode & Password Baru</CardTitle>
                <CardDescription className="flex items-start gap-1.5">
                  <Send size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>{info || `Kode verifikasi telah dikirim ke Telegram Anda.`}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Kode Verifikasi</label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="123456"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password Baru</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Minimal 6 karakter"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Konfirmasi Password Baru</label>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Ulangi password baru"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Memproses...' : 'Reset Password'}
                  </Button>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('email');
                      setError('');
                      setCode('');
                    }}
                    className="flex items-center justify-center gap-1.5 w-full text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft size={14} />
                    Ganti email / kirim ulang kode
                  </button>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
