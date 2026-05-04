import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(time: string | null): string {
  if (!time) return '-';
  return time;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    HADIR: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    TERLAMBAT: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    PULANG_CEPAT: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    IZIN: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    SAKIT: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    CUTI: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    DINAS_LUAR: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
    TIDAK_HADIR: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    AUTO_CHECKOUT: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300',
    LIBUR: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    APPROVED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    DRAFT: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    FINALIZED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  };
  return colors[status] || 'bg-slate-100 text-slate-600';
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    HADIR: 'Hadir',
    TERLAMBAT: 'Terlambat',
    PULANG_CEPAT: 'Pulang Cepat',
    IZIN: 'Izin',
    SAKIT: 'Sakit',
    CUTI: 'Cuti',
    DINAS_LUAR: 'Dinas Luar',
    TIDAK_HADIR: 'Tidak Hadir',
    AUTO_CHECKOUT: 'Auto Checkout',
    LIBUR: 'Libur',
    PENDING: 'Menunggu',
    APPROVED: 'Disetujui',
    REJECTED: 'Ditolak',
    DRAFT: 'Draft',
    PREVIEW: 'Preview',
    FINALIZED: 'Final',
  };
  return labels[status] || status;
}
