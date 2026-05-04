import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { useAuthStore } from '@/stores/authStore';
import { useDataStore } from '@/stores/dataStore';
import { generateId } from '@/lib/attendance';
import { CalendarDays, Plus, Pencil, Trash2 } from 'lucide-react';
import type { Holiday } from '@/types';

export default function HolidaySettings() {
  const { currentUser, activeCompany } = useAuthStore();
  const { holidays, addHoliday, updateHoliday, deleteHoliday } = useDataStore();
  const companyId = activeCompany?.id || currentUser?.company_id || '';

  const companyHolidays = holidays
    .filter((h) => h.company_id === companyId)
    .sort((a, b) => a.date.localeCompare(b.date));

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Holiday | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Holiday | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [isNational, setIsNational] = useState(false);

  const resetForm = () => {
    setName('');
    setDate('');
    setIsNational(false);
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (h: Holiday) => {
    setEditing(h);
    setName(h.name);
    setDate(h.date);
    setIsNational(h.is_national);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !date) return;

    if (editing) {
      updateHoliday(editing.id, {
        name: name.trim(),
        date,
        is_national: isNational,
      });
    } else {
      addHoliday({
        id: generateId('HOL'),
        company_id: companyId,
        name: name.trim(),
        date,
        is_national: isNational,
      });
    }
    resetForm();
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteHoliday(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hari Libur"
        subtitle="Kelola hari libur nasional dan perusahaan"
        backTo="/settings"
        action={
          <Button onClick={() => setShowForm(true)} size="sm" className="gap-1">
            <Plus className="h-4 w-4" /> Tambah
          </Button>
        }
      />

      {companyHolidays.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Belum ada hari libur"
          description="Tambahkan hari libur nasional atau perusahaan"
          action={
            <Button onClick={() => setShowForm(true)} size="sm">
              <Plus className="h-4 w-4 mr-1" /> Tambah Hari Libur
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {companyHolidays.map((h) => (
            <Card key={h.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CalendarDays className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{h.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(h.date).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  {h.is_national && (
                    <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 px-2 py-0.5 rounded-full">
                      Nasional
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(h)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(h)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_national"
                checked={isNational}
                onChange={(e) => setIsNational(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="is_national" className="text-sm">
                Hari libur nasional
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
