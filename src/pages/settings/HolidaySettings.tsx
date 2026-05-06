import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/authStore';
import { useDataStore } from '@/stores/dataStore';
import { generateId } from '@/lib/attendance';
import { CalendarDays, Plus, Pencil, Trash2, Download, ToggleLeft, ToggleRight } from 'lucide-react';
import type { Holiday, HolidayType } from '@/types';

// Default holidays for 2026 that can be imported
const HOLIDAYS_2026: Omit<Holiday, 'id' | 'company_id'>[] = [
  { name: 'Tahun Baru', date: '2026-01-01', type: 'Nasional', is_national: true, is_active: true, early_leave_time: null },
  { name: 'Cuti Bersama Tahun Baru', date: '2026-01-02', type: 'Nasional', is_national: true, is_active: true, early_leave_time: null },
  { name: 'Isra Miraj', date: '2026-02-08', type: 'Islam', is_national: false, is_active: true, early_leave_time: null },
  { name: 'Cuti Bersama Isra Miraj', date: '2026-02-09', type: 'Islam', is_national: false, is_active: true, early_leave_time: null },
  { name: 'Libur Lebaran', date: '2026-03-18', type: 'Islam', is_national: false, is_active: true, early_leave_time: null },
  { name: 'Libur Lebaran', date: '2026-03-19', type: 'Islam', is_national: false, is_active: true, early_leave_time: null },
  { name: 'Libur Lebaran', date: '2026-03-20', type: 'Islam', is_national: false, is_active: true, early_leave_time: null },
  { name: 'Libur Lebaran', date: '2026-03-21', type: 'Islam', is_national: false, is_active: true, early_leave_time: null },
  { name: 'Libur Lebaran', date: '2026-03-22', type: 'Islam', is_national: false, is_active: true, early_leave_time: null },
  { name: 'Libur Lebaran', date: '2026-03-23', type: 'Islam', is_national: false, is_active: true, early_leave_time: null },
  { name: 'Libur Lebaran', date: '2026-03-24', type: 'Islam', is_national: false, is_active: true, early_leave_time: null },
  { name: 'Libur Lebaran', date: '2026-03-25', type: 'Islam', is_national: false, is_active: true, early_leave_time: null },
  { name: 'Libur Lebaran', date: '2026-03-26', type: 'Islam', is_national: false, is_active: true, early_leave_time: null },
  { name: 'Libur Lebaran', date: '2026-03-27', type: 'Islam', is_national: false, is_active: true, early_leave_time: null },
  { name: 'Libur Lebaran', date: '2026-03-28', type: 'Islam', is_national: false, is_active: true, early_leave_time: null },
  { name: 'Libur Lebaran', date: '2026-03-29', type: 'Islam', is_national: false, is_active: true, early_leave_time: null },
  { name: 'Cuti Bersama Idul Fitri', date: '2026-04-08', type: 'Islam', is_national: false, is_active: true, early_leave_time: null },
  { name: 'Cuti Bersama Idul Fitri', date: '2026-04-09', type: 'Islam', is_national: false, is_active: true, early_leave_time: null },
  { name: 'Idul Fitri 1', date: '2026-04-10', type: 'Islam', is_national: false, is_active: true, early_leave_time: null },
  { name: 'Idul Fitri 2', date: '2026-04-11', type: 'Islam', is_national: false, is_active: true, early_leave_time: null },
  { name: 'Cuti Bersama Idul Fitri', date: '2026-04-13', type: 'Islam', is_national: false, is_active: true, early_leave_time: null },
  { name: 'Cuti Bersama Idul Fitri', date: '2026-04-14', type: 'Islam', is_national: false, is_active: true, early_leave_time: null },
  { name: 'Hari Buruh', date: '2026-05-01', type: 'Setengah Hari', is_national: false, is_active: true, early_leave_time: '15:00' },
  { name: 'Kenaikan Isa Almasih', date: '2026-05-14', type: 'Setengah Hari', is_national: false, is_active: true, early_leave_time: '15:00' },
  { name: 'Hari Raya Waisak', date: '2026-05-23', type: 'Setengah Hari', is_national: false, is_active: true, early_leave_time: '15:00' },
  { name: 'Cuti Bersama Waisak', date: '2026-05-25', type: 'Setengah Hari', is_national: false, is_active: true, early_leave_time: '15:00' },
  { name: 'Hari Lahir Pancasila', date: '2026-06-01', type: 'Setengah Hari', is_national: false, is_active: true, early_leave_time: '15:00' },
  { name: 'Idul Adha', date: '2026-06-17', type: 'Islam', is_national: false, is_active: true, early_leave_time: null },
  { name: 'Cuti Bersama Idul Adha', date: '2026-06-18', type: 'Nasional', is_national: true, is_active: true, early_leave_time: null },
  { name: 'Tahun Baru Islam 1448H', date: '2026-07-07', type: 'Islam', is_national: false, is_active: true, early_leave_time: null },
  { name: 'Hari Kemerdekaan RI', date: '2026-08-17', type: 'Nasional', is_national: true, is_active: true, early_leave_time: null },
  { name: 'Maulid Nabi Muhammad SAW', date: '2026-09-15', type: 'Islam', is_national: false, is_active: true, early_leave_time: null },
  { name: 'Cuti Bersama Natal', date: '2026-12-24', type: 'Nasional', is_national: true, is_active: true, early_leave_time: null },
  { name: 'Hari Natal', date: '2026-12-25', type: 'Nasional', is_national: true, is_active: true, early_leave_time: null },
  { name: 'Cuti Bersama Natal', date: '2026-12-26', type: 'Nasional', is_national: true, is_active: true, early_leave_time: null },
];

const HOLIDAYS_2027: Omit<Holiday, 'id' | 'company_id'>[] = [
  { name: 'Tahun Baru', date: '2027-01-01', type: 'Nasional', is_national: true, is_active: true, early_leave_time: null },
  { name: 'Isra Miraj', date: '2027-01-28', type: 'Islam', is_national: false, is_active: true, early_leave_time: null },
  { name: 'Idul Fitri 1', date: '2027-03-30', type: 'Islam', is_national: false, is_active: true, early_leave_time: null },
  { name: 'Idul Fitri 2', date: '2027-03-31', type: 'Islam', is_national: false, is_active: true, early_leave_time: null },
  { name: 'Hari Buruh', date: '2027-05-01', type: 'Setengah Hari', is_national: false, is_active: true, early_leave_time: '15:00' },
  { name: 'Kenaikan Isa Almasih', date: '2027-05-06', type: 'Setengah Hari', is_national: false, is_active: true, early_leave_time: '15:00' },
  { name: 'Hari Raya Waisak', date: '2027-05-13', type: 'Setengah Hari', is_national: false, is_active: true, early_leave_time: '15:00' },
  { name: 'Hari Lahir Pancasila', date: '2027-06-01', type: 'Setengah Hari', is_national: false, is_active: true, early_leave_time: '15:00' },
  { name: 'Idul Adha', date: '2027-06-06', type: 'Islam', is_national: false, is_active: true, early_leave_time: null },
  { name: 'Tahun Baru Islam 1449H', date: '2027-06-27', type: 'Islam', is_national: false, is_active: true, early_leave_time: null },
  { name: 'Hari Kemerdekaan RI', date: '2027-08-17', type: 'Nasional', is_national: true, is_active: true, early_leave_time: null },
  { name: 'Maulid Nabi Muhammad SAW', date: '2027-09-05', type: 'Islam', is_national: false, is_active: true, early_leave_time: null },
  { name: 'Hari Natal', date: '2027-12-25', type: 'Nasional', is_national: true, is_active: true, early_leave_time: null },
];

function getTypeBadge(type: HolidayType) {
  switch (type) {
    case 'Islam':
      return <Badge className="bg-green-600 hover:bg-green-700 text-white text-xs">☪ Islam</Badge>;
    case 'Nasional':
      return <Badge className="bg-red-600 hover:bg-red-700 text-white text-xs">🏴 Nasional</Badge>;
    case 'Setengah Hari':
      return <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-xs">◐ Setengah Hari</Badge>;
  }
}

export default function HolidaySettings() {
  const { currentUser, activeCompany } = useAuthStore();
  const { holidays, addHoliday, updateHoliday, deleteHoliday } = useDataStore();
  const companyId = activeCompany?.id || currentUser?.company_id || '';

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const companyHolidays = useMemo(() => {
    return holidays
      .filter((h) => h.company_id === companyId && h.date.startsWith(String(selectedYear)))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [holidays, companyId, selectedYear]);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Holiday | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Holiday | null>(null);
  const [showImportConfirm, setShowImportConfirm] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<HolidayType>('Nasional');
  const [isActive, setIsActive] = useState(true);
  const [earlyLeaveTime, setEarlyLeaveTime] = useState('');

  const resetForm = () => {
    setName('');
    setDate('');
    setType('Nasional');
    setIsActive(true);
    setEarlyLeaveTime('');
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (h: Holiday) => {
    setEditing(h);
    setName(h.name);
    setDate(h.date);
    setType(h.type || 'Nasional');
    setIsActive(h.is_active !== false);
    setEarlyLeaveTime(h.early_leave_time || '');
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date) return;

    const holidayData: Partial<Holiday> = {
      name: name.trim(),
      date,
      type,
      is_national: type === 'Nasional',
      is_active: isActive,
      early_leave_time: type === 'Setengah Hari' ? (earlyLeaveTime || '15:00') : null,
    };

    if (editing) {
      updateHoliday(editing.id, holidayData);
    } else {
      addHoliday({
        id: generateId('HOL'),
        company_id: companyId,
        ...holidayData,
      } as Holiday);
    }
    resetForm();
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteHoliday(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const handleToggleActive = (h: Holiday) => {
    updateHoliday(h.id, { is_active: !h.is_active });
  };

  const handleImport = () => {
    const importData = selectedYear === 2026 ? HOLIDAYS_2026 : selectedYear === 2027 ? HOLIDAYS_2027 : [];
    if (importData.length === 0) {
      setShowImportConfirm(false);
      return;
    }

    // Check existing dates to avoid duplicates
    const existingDates = new Set(companyHolidays.map(h => h.date));

    importData.forEach((h) => {
      if (!existingDates.has(h.date)) {
        addHoliday({
          id: generateId('HOL'),
          company_id: companyId,
          ...h,
        } as Holiday);
      }
    });
    setShowImportConfirm(false);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kalender Libur"
        subtitle="Atur hari libur nasional, Islam, dan perusahaan"
        backTo="/settings"
        action={
          <div className="flex gap-2">
            <Button
              onClick={() => setShowImportConfirm(true)}
              size="sm"
              variant="outline"
              className="gap-1"
            >
              <Download className="h-4 w-4" /> Import Libur {selectedYear}
            </Button>
            <Button onClick={() => setShowForm(true)} size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> Tambah Libur
            </Button>
          </div>
        }
      />

      {/* Info Note */}
      <Card className="border-yellow-500/50 bg-yellow-500/5">
        <CardContent className="p-4">
          <p className="text-sm">
            <span className="font-semibold text-yellow-600 dark:text-yellow-400">Catatan:</span>{' '}
            Hanya libur yang aktif akan dihitung sebagai hari tidak masuk kerja. Sesuaikan dengan kebijakan perusahaan (hanya libur kemerdekaan & Islam).
          </p>
        </CardContent>
      </Card>

      {/* Year Filter */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Tahun:</span>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="rounded-md border bg-background px-3 py-1.5 text-sm"
        >
          <option value={2025}>2025</option>
          <option value={2026}>2026</option>
          <option value={2027}>2027</option>
          <option value={2028}>2028</option>
        </select>
      </div>

      {companyHolidays.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Belum ada hari libur"
          description={`Belum ada data libur untuk tahun ${selectedYear}. Import atau tambahkan manual.`}
          action={
            <div className="flex gap-2">
              <Button onClick={() => setShowImportConfirm(true)} size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" /> Import Libur {selectedYear}
              </Button>
              <Button onClick={() => setShowForm(true)} size="sm">
                <Plus className="h-4 w-4 mr-1" /> Tambah Hari Libur
              </Button>
            </div>
          }
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left px-4 py-3 font-medium">Tanggal</th>
                    <th className="text-left px-4 py-3 font-medium">Nama Libur</th>
                    <th className="text-left px-4 py-3 font-medium">Jenis</th>
                    <th className="text-left px-4 py-3 font-medium">Jam Pulang</th>
                    <th className="text-left px-4 py-3 font-medium">Status</th>
                    <th className="text-center px-4 py-3 font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {companyHolidays.map((h) => (
                    <tr key={h.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                        {formatDate(h.date)}
                      </td>
                      <td className="px-4 py-3 font-medium">{h.name}</td>
                      <td className="px-4 py-3">{getTypeBadge(h.type || 'Nasional')}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {h.early_leave_time || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={
                            h.is_active !== false
                              ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                              : 'bg-gray-500 hover:bg-gray-600 text-white'
                          }
                        >
                          {h.is_active !== false ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(h)}
                            title={h.is_active !== false ? 'Nonaktifkan' : 'Aktifkan'}
                            className="h-8 w-8 p-0"
                          >
                            {h.is_active !== false ? (
                              <ToggleRight className="h-4 w-4 text-yellow-500" />
                            ) : (
                              <ToggleLeft className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(h)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteTarget(h)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Hari Libur' : 'Tambah Hari Libur'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Hari Libur</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Hari Raya Idul Fitri"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tanggal</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Jenis Libur</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as HolidayType)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="Islam">☪ Islam</option>
                <option value="Nasional">🏴 Nasional</option>
                <option value="Setengah Hari">◐ Setengah Hari</option>
              </select>
            </div>
            {type === 'Setengah Hari' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Jam Pulang</label>
                <Input
                  type="time"
                  value={earlyLeaveTime || '15:00'}
                  onChange={(e) => setEarlyLeaveTime(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Karyawan tetap masuk tapi pulang lebih awal pada jam ini
                </p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-border"
              />
              <label htmlFor="is_active" className="text-sm">
                Aktif (dihitung sebagai hari libur)
              </label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>
                Batal
              </Button>
              <Button type="submit">{editing ? 'Simpan' : 'Tambah'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Import Confirmation */}
      <ConfirmModal
        open={showImportConfirm}
        onOpenChange={setShowImportConfirm}
        title={`Import Libur ${selectedYear}`}
        description={`Import data hari libur nasional, Islam, dan setengah hari untuk tahun ${selectedYear}? Data yang sudah ada (berdasarkan tanggal) tidak akan ditimpa.`}
        confirmLabel="Import"
        variant="default"
        onConfirm={handleImport}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Hapus Hari Libur"
        description={`Yakin ingin menghapus "${deleteTarget?.name}"?`}
        confirmLabel="Hapus"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
