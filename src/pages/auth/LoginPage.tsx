import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { demoAccounts } from '@/lib/mock-data';
import { Building2, Eye, EyeOff, Moon, Sun } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, userCompanies } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(email, password);
    if (success) {
      const state = useAuthStore.getState();
      if (state.userCompanies.length > 1) {
        navigate('/pick-company');
      } else if (state.currentUser?.role === 'SUPER_ADMIN') {
        navigate('/owner');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError('Email atau password salah');
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('admin123');
    const success = login(demoEmail, 'admin123');
    if (success) {
      const state = useAuthStore.getState();
      if (state.userCompanies.length > 1) {
        navigate('/pick-company');
      } else if (state.currentUser?.role === 'SUPER_ADMIN') {
        navigate('/owner');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900 p-4 relative">
      {/* Theme Toggle - Top Right */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-all"
        title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      >
        {theme === 'light' ? <Moon size={18} className="text-gray-700" /> : <Sun size={18} className="text-yellow-400" />}
      </button>

      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Maulana Corp</h1>
          <p className="text-muted-foreground mt-1">Attendance & Payroll System v2.0</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Masuk</CardTitle>
            <CardDescription>Masukkan email dan password untuk melanjutkan</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
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
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
              <Button type="submit" className="w-full">
                Masuk
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Demo Accounts (klik untuk login)</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {demoAccounts.map(account => (
              <button
                key={account.email}
                onClick={() => handleDemoLogin(account.email)}
                className="flex items-center justify-between px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors text-left"
              >
                <span className="font-medium">{account.label}</span>
                <span className="text-xs text-muted-foreground">{account.email}</span>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
