import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { Bell, Moon, Sun, Building2, ChevronDown, User, Menu, Cloud, CloudOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { notifications } from '@/lib/mock-data';
import { useState, useMemo } from 'react';

export function Header() {
  const { currentUser, activeCompany, userCompanies, switchCompany, logout } = useAuthStore();
  const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useUIStore();
  const { syncStatus, syncError, pendingMutations, lastSyncedAt, refreshFromServer, uploadDeviceData } = useAttendanceStore();
  const isDark = useMemo(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return theme === 'dark';
  }, [theme]);
  const navigate = useNavigate();
  const [showCompanyMenu, setShowCompanyMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  if (!currentUser) return null;

  const userNotifications = notifications.filter(
    n => n.user_id === currentUser.id && n.company_id === activeCompany?.id
  );
  const unreadCount = userNotifications.filter(n => !n.is_read).length;

  return (
    <header className={cn(
      'sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 transition-all duration-300',
      !sidebarOpen && 'pl-14 md:pl-6'
    )}>
      {/* Left: Menu toggle + Page info */}
      <div className="flex items-center gap-3">
        {/* Hamburger — hidden on md+ since floating button handles it */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-1.5 rounded-md hover:bg-accent transition-colors"
          title="Menu"
        >
          <Menu size={20} />
        </button>
        {/* On desktop, show menu button in header when sidebar closed */}
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="hidden md:flex p-1.5 rounded-md hover:bg-accent transition-colors"
            title="Buka Menu"
          >
            <Menu size={20} />
          </button>
        )}
        <h2 className="text-lg font-semibold text-foreground">
          {activeCompany?.name || 'Dashboard'}
        </h2>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => void refreshFromServer().catch(() => {})}
          className={cn(
            'flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs transition-colors hover:bg-accent',
            syncStatus === 'offline' ? 'text-red-600' : 'text-emerald-600',
          )}
          title={syncError || (pendingMutations.length > 0
            ? `${pendingMutations.length} perubahan menunggu sinkronisasi`
            : lastSyncedAt
              ? `Tersinkron: ${new Date(lastSyncedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
              : 'Data tersinkron realtime')}
        >
          {syncStatus === 'offline' ? <CloudOff size={16} /> : <Cloud size={16} />}
          <span className="hidden lg:inline">
            {syncStatus === 'syncing'
              ? 'Sinkronisasi...'
              : syncStatus === 'offline'
                ? 'Offline'
                : pendingMutations.length > 0
                  ? `Menunggu (${pendingMutations.length})`
                  : lastSyncedAt
                    ? `Sync ${new Date(lastSyncedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
                    : 'Realtime'}
          </span>
        </button>

        {/* Company Switcher (if multi-company) */}
        {userCompanies.length > 1 && (
          <div className="relative">
            <button
              onClick={() => setShowCompanyMenu(!showCompanyMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors"
            >
              <Building2 size={16} />
              <span className="hidden sm:inline">{activeCompany?.name}</span>
              <ChevronDown size={14} />
            </button>
            {showCompanyMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 rounded-md border bg-popover p-1 shadow-md">
                {userCompanies.map(company => (
                  <button
                    key={company.id}
                    onClick={() => {
                      switchCompany(company.id);
                      setShowCompanyMenu(false);
                    }}
                    className={cn(
                      'w-full text-left px-3 py-2 text-sm rounded-sm hover:bg-accent transition-colors',
                      company.id === activeCompany?.id && 'bg-accent font-medium'
                    )}
                  >
                    {company.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-accent transition-colors"
          title={isDark ? 'Light Mode' : 'Dark Mode'}
        >
          {isDark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-md hover:bg-accent transition-colors relative"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-full mt-1 w-80 rounded-md border bg-popover shadow-md max-h-96 overflow-y-auto">
              <div className="p-3 border-b">
                <h3 className="font-semibold text-sm">Notifikasi</h3>
              </div>
              {userNotifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Tidak ada notifikasi
                </div>
              ) : (
                userNotifications.slice(0, 5).map(notif => (
                  <div
                    key={notif.id}
                    className={cn(
                      'p-3 border-b last:border-0 hover:bg-accent/50 cursor-pointer',
                      !notif.is_read && 'bg-primary/5'
                    )}
                  >
                    <p className="text-sm font-medium">{notif.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User size={16} className="text-primary" />
            </div>
            <span className="hidden sm:inline text-sm font-medium">{currentUser.full_name.split(' ')[0]}</span>
          </button>
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 rounded-md border bg-popover p-1 shadow-md">
              <div className="px-3 py-2 border-b">
                <p className="text-sm font-medium">{currentUser.full_name}</p>
                <p className="text-xs text-muted-foreground">{currentUser.position || currentUser.role}</p>
              </div>
              {userCompanies.length > 1 && (
                <button
                  onClick={() => { navigate('/pick-company'); setShowUserMenu(false); }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-sm"
                >
                  Ganti Perusahaan
                </button>
              )}
              <button
                onClick={() => { navigate('/profile'); setShowUserMenu(false); }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-sm"
              >
                Profil & Keamanan
              </button>
              <button
                onClick={async () => {
                  setUploadMessage('Mengunggah...');
                  try {
                    const total = await uploadDeviceData();
                    setUploadMessage(`${total} data HP sudah disinkronkan`);
                  } catch {
                    setUploadMessage('Upload gagal—cek koneksi');
                  }
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-sm"
              >
                Upload data HP ini
              </button>
              {uploadMessage && (
                <p className="px-3 pb-2 text-xs text-muted-foreground">{uploadMessage}</p>
              )}
              <button
                onClick={() => { logout(); navigate('/login'); setShowUserMenu(false); }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-sm text-red-600"
              >
                Keluar
              </button>
              <div className="px-3 py-2 border-t">
                <p className="text-xs text-muted-foreground">Jabatan Perusahaan</p>
                <p className="text-sm font-medium">{currentUser.position || '-'}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{activeCompany?.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
