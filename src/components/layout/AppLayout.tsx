import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

export function AppLayout() {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className={cn('transition-all duration-300', sidebarOpen ? 'md:ml-64' : 'md:ml-0', 'ml-0')}>
        <Header />
        <main className="p-4 md:p-6 pb-20 md:pb-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
