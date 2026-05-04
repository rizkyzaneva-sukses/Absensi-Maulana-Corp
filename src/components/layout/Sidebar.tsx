import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import {
  LayoutDashboard, Clock, History, FileText, Users, DollarSign,
  BarChart3, Settings, Building2, ChevronLeft, LogOut, Briefcase,
  CheckCircle, ClipboardList, FileEdit, ScrollText, QrCode, ListTodo,
  LogIn, LogOut as LogOutIcon, BookOpen
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'KARYAWAN'] },
  { label: 'Check-in', path: '/check-in', icon: <LogIn size={20} />, roles: ['KARYAWAN', 'MANAGER'] },
  { label: 'Check-out', path: '/check-out', icon: <LogOutIcon size={20} />, roles: ['KARYAWAN', 'MANAGER'] },
  { label: 'Riwayat Saya', path: '/my-history', icon: <History size={20} />, roles: ['KARYAWAN', 'MANAGER'] },
  { label: 'Pengajuan Saya', path: '/my-requests', icon: <FileText size={20} />, roles: ['KARYAWAN', 'MANAGER'] },
  { label: 'Manager', path: '/manager', icon: <Clock size={20} />, roles: ['MANAGER', 'COMPANY_ADMIN'] },
  { label: 'Approval Cuti', path: '/approvals/leave', icon: <CheckCircle size={20} />, roles: ['MANAGER', 'COMPANY_ADMIN'] },
  { label: 'Approval Lembur', path: '/approvals/overtime', icon: <ClipboardList size={20} />, roles: ['MANAGER', 'COMPANY_ADMIN'] },
  { label: 'Approval Koreksi', path: '/approvals/correction', icon: <FileEdit size={20} />, roles: ['MANAGER', 'COMPANY_ADMIN'] },
  { label: 'Audit Log', path: '/audit-log', icon: <ScrollText size={20} />, roles: ['COMPANY_ADMIN', 'SUPER_ADMIN'] },
  { label: 'Cetak QR', path: '/print-qr', icon: <QrCode size={20} />, roles: ['COMPANY_ADMIN', 'SUPER_ADMIN'] },
  { label: 'Revisi', path: '/revisions', icon: <ListTodo size={20} />, roles: ['COMPANY_ADMIN', 'SUPER_ADMIN'] },
  { label: 'Karyawan', path: '/employees', icon: <Users size={20} />, roles: ['COMPANY_ADMIN', 'SUPER_ADMIN'] },
  { label: 'Payroll', path: '/payroll', icon: <DollarSign size={20} />, roles: ['COMPANY_ADMIN', 'SUPER_ADMIN'] },
  { label: 'Analytics', path: '/analytics', icon: <BarChart3 size={20} />, roles: ['MANAGER', 'COMPANY_ADMIN', 'SUPER_ADMIN'] },
  { label: 'Pengaturan', path: '/settings', icon: <Settings size={20} />, roles: ['COMPANY_ADMIN', 'SUPER_ADMIN'] },
  { label: 'Panduan', path: '/guide', icon: <BookOpen size={20} />, roles: ['SUPER_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'KARYAWAN'] },
];

const ownerItems: NavItem[] = [
  { label: 'Owner Dashboard', path: '/owner', icon: <Building2 size={20} />, roles: ['SUPER_ADMIN'] },
  { label: 'Kelola Perusahaan', path: '/owner/companies', icon: <Briefcase size={20} />, roles: ['SUPER_ADMIN'] },
];

export function Sidebar() {
  const { currentUser, activeCompany, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const location = useLocation();

  if (!currentUser) return null;

  const role = currentUser.role;
  const filteredNav = navItems.filter(item => item.roles.includes(role));
  const filteredOwner = ownerItems.filter(item => item.roles.includes(role));

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 flex flex-col',
        sidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">
              {activeCompany?.name?.charAt(0) || 'M'}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">{activeCompany?.name || 'Maulana Corp'}</span>
              <span className="text-xs text-slate-400">v2.0</span>
            </div>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className={cn('w-5 h-5 transition-transform', !sidebarOpen && 'rotate-180')} />
        </button>
      </div>

      {/* Owner Nav */}
      {filteredOwner.length > 0 && (
        <div className="px-3 py-2">
          {sidebarOpen && <p className="text-xs text-slate-500 uppercase tracking-wider px-3 mb-1">Owner</p>}
          {filteredOwner.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors mb-0.5',
                isActive ? 'bg-primary/20 text-primary' : 'text-slate-300 hover:bg-white/5 hover:text-white'
              )}
            >
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
          <div className="border-b border-white/10 my-2" />
        </div>
      )}

      {/* Main Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        {sidebarOpen && <p className="text-xs text-slate-500 uppercase tracking-wider px-3 mb-1">Menu</p>}
        {filteredNav.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors mb-0.5',
              isActive ? 'bg-primary/20 text-primary' : 'text-slate-300 hover:bg-white/5 hover:text-white'
            )}
          >
            {item.icon}
            {sidebarOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors w-full"
        >
          <LogOut size={20} />
          {sidebarOpen && <span>Keluar</span>}
        </button>
      </div>
    </aside>
  );
}
