import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Clock, FileText, History, BarChart3 } from 'lucide-react';

const navItems = [
  { label: 'Home', path: '/dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'KARYAWAN'] },
  { label: 'Check In', path: '/check-in', icon: Clock, roles: ['KARYAWAN', 'MANAGER'] },
  { label: 'Pengajuan', path: '/my-requests', icon: FileText, roles: ['KARYAWAN', 'MANAGER'] },
  { label: 'Riwayat', path: '/my-history', icon: History, roles: ['KARYAWAN', 'MANAGER'] },
  { label: 'Analytics', path: '/analytics', icon: BarChart3, roles: ['MANAGER', 'COMPANY_ADMIN', 'SUPER_ADMIN'] },
];

export function BottomNav() {
  const { currentUser } = useAuthStore();
  if (!currentUser) return null;

  const filteredItems = navItems.filter((item) => item.roles.includes(currentUser.role));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {filteredItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 px-2 py-1 rounded-md text-xs transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
