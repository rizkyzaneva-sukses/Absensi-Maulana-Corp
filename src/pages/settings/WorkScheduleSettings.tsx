import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { useAuthStore } from '@/stores/authStore';
import { useDataStore, type WorkSchedule } from '@/stores/dataStore';
import { generateId } from '@/lib/attendance';
import { Clock, Plus, Pencil, Trash2, Users } from 'lucide-react';

const DAYS = [
  { key: 'monday', label: 'Senin' },
  { key: 'tuesday', label: 'Selasa' },
  { key: 'wednesday', label: 'Rabu' },
  { key: 'thursday', label: 'Kamis' },
  { key: 'friday', label: 'Jumat' },
  { key: 'saturday', label: 'Sabtu' },
  { key: 'sunday', label: 'Minggu' },
];

const DEFAULT_HOURS: Record<string, { start: string; end: string; is_workday: boolean }> = {
  monday: { start: '08:00', end: '17:00', is_workday: true },
  tuesday: { start: '08:00', end: '17:00', is_workday: true },
  wednesday: { start: '08:00', end: '17:00', is_workday: true },
  thursday: { start: '08:00', end: '17:00', is_workday: true },
  friday: { start: '08:00', end: '17:00', is_workday: true },
  saturday: { start: '08:00', end: '12:00', is_workday: false },
  sunday: { start: '08:00', end: '12:00', is_workday: false },
};

export default function WorkScheduleSettings() {
  const { currentUser, activeCompany } = useAuthStore();
  const { workSchedules, addWorkSchedule, updateWorkSchedule, deleteWorkSchedule } = useDataStore();
  const companyId = activeCompany?.id || currentUser?.company_id || '';

  const companySchedules = workSchedules.filter((ws) => ws.company_id === companyId);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<WorkSchedule | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WorkSchedule | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [workHours, setWorkHours] = useState<Record<string, { start: string; end: string; is_workday: boolean }>>(
    JSON.parse(JSON.stringify(DEFAULT_HOURS))
  );

  const resetForm = () => {
    setName('');
    setDescription('');
    setWorkHours(JSON.parse(JSON.stringify(DEFAULT_HOURS)));
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (ws: WorkSchedule) => {
    setEditing(ws);
    setName(ws.name);
    setDescription(ws.description);
    setWorkHours(JSON.parse(JSON.stringify(ws.work_hours)));
    setShowForm(true);
  };

  const updateDayHours = (day: string, field: string, value: string | boolean) => {
    setWorkHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editing) {
      updateWorkSchedule(editing.id, {
        name: name.trim(),
        description: description.trim(),
        work_hours: workHours,
      });
    } else {
      addWorkSchedule({
        id: generateId('WS'),
        company_id: companyId,
        name: name.trim(),
        description: description.trim(),
        employee_emails: [],
        work_hours: workHours,
        is_active: true,
      });
    }
    resetForm();
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteWorkSchedule(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const countWorkdays = (hours: Record<string, { start: string; end: string; is_workday: boolean }>) => {
    return Object.values(hours).filter((h) => h.is_workday).length;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jadwal Kerja"
        subtitle="Kelola jadwal kerja karyawan"
        backTo="/settings"
        action={
          <Button onClick={() => setShowForm(true)} size="sm" className="gap-1">
            <Plus className="h-4 w-4" /> Tambah
          </Button>
        }
      />

      {companySchedules.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="Belum ada jadwal kerja"
          description="Buat jadwal kerja khusus untuk karyawan tertentu"
          action={
            <Button onClick={() => setShowForm(true)} size="sm">
              <Plus className="h-4 w-4 mr-1" /> Buat Jadwal
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {companySchedules.map((ws) => (
            <Card key={ws.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{ws.name}</p>
                      {!ws.is_active && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          Nonaktif
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{ws.description || 'Tidak ada deskripsi'}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span>{countWorkdays(ws.work_hours)} hari kerja</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {ws.employee_emails.length} karyawan
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(ws)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(ws)}>
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Jadwal Kerja' : 'Buat Jadwal Kerja'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Jadwal</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Shift Pagi"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Deskripsi</label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi jadwal (opsional)"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Jam Kerja per Hari</label>
              {DAYS.map((day) => (
                <div key={day.key} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 w-24">
                    <input
                      type="checkbox"
                      checked={workHours[day.key]?.is_workday ?? false}
                      onChange={(e) => updateDayHours(day.key, 'is_workday', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm font-medium">{day.label}</span>
                  </div>
                  <Input
                    type="time"
                    value={workHours[day.key]?.start || '08:00'}
                    onChange={(e) => updateDayHours(day.key, 'start', e.target.value)}
                    className="w-28 text-xs"
                    disabled={!workHours[day.key]?.is_workday}
                  />
                  <span className="text-xs text-muted-foreground">-</span>
                  <Input
                    type="time"
                    value={workHours[day.key]?.end || '17:00'}
                    onChange={(e) => updateDayHours(day.key, 'end', e.target.value)}
                    className="w-28 text-xs"
                    disabled={!workHours[day.key]?.is_workday}
                  />
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>
                Batal
              </Button>
              <Button type="submit">{editing ? 'Simpan' : 'Buat'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Hapus Jadwal Kerja"
        description={`Yakin ingin menghapus jadwal "${deleteTarget?.name}"? Karyawan yang menggunakan jadwal ini akan kembali ke jadwal default.`}
        confirmLabel="Hapus"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
