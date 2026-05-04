import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { useAuthStore } from '@/stores/authStore';
import { useDataStore, type Revision } from '@/stores/dataStore';
import { generateId } from '@/lib/attendance';
import { ListTodo, Plus, Pencil, Trash2, Calendar } from 'lucide-react';

export default function RevisionListPage() {
  const { currentUser, activeCompany } = useAuthStore();
  const { revisions, addRevision, updateRevision, deleteRevision } = useDataStore();
  const companyId = activeCompany?.id || currentUser?.company_id || '';

  const companyRevisions = revisions
    .filter((r) => r.company_id === companyId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Revision | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Revision | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<Revision['status']>('PENDING');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
    setDueDate('');
    setStatus('PENDING');
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (r: Revision) => {
    setEditing(r);
    setTitle(r.title);
    setDescription(r.description);
    setPriority(r.priority);
    setDueDate(r.due_date);
    setStatus(r.status);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editing) {
      updateRevision(editing.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        due_date: dueDate,
        status,
      });
    } else {
      addRevision({
        id: generateId('REV'),
        company_id: companyId,
        title: title.trim(),
        description: description.trim(),
        status: 'PENDING',
        priority,
        assigned_to: currentUser?.user_email || '',
        due_date: dueDate,
        created_at: new Date().toISOString(),
      });
    }
    resetForm();
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteRevision(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const getStatusColor = (s: Revision['status']) => {
    switch (s) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
      case 'COMPLETED':
        return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-300';
      default:
        return '';
    }
  };

  const getStatusLabel = (s: Revision['status']) => {
    switch (s) {
      case 'PENDING': return 'Menunggu';
      case 'IN_PROGRESS': return 'Dikerjakan';
      case 'COMPLETED': return 'Selesai';
      case 'CANCELLED': return 'Dibatalkan';
      default: return s;
    }
  };

  const getPriorityColor = (p: Revision['priority']) => {
    switch (p) {
      case 'HIGH': return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
      case 'MEDIUM': return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
      case 'LOW': return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daftar Revisi"
        subtitle="Kelola catatan revisi dan perbaikan"
        backTo="/dashboard"
        action={
          <Button onClick={() => setShowForm(true)} size="sm" className="gap-1">
            <Plus className="h-4 w-4" /> Tambah
          </Button>
        }
      />

      {companyRevisions.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="Belum ada revisi"
          description="Buat catatan revisi untuk tracking perbaikan"
          action={
            <Button onClick={() => setShowForm(true)} size="sm">
              <Plus className="h-4 w-4 mr-1" /> Buat Revisi
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {companyRevisions.map((rev) => (
            <Card key={rev.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-medium text-sm">{rev.title}</p>
                      <Badge className={getStatusColor(rev.status)} variant="outline">
                        {getStatusLabel(rev.status)}
                      </Badge>
                      <Badge className={getPriorityColor(rev.priority)} variant="outline">
                        {rev.priority}
                      </Badge>
                    </div>
                    {rev.description && (
                      <p className="text-xs text-muted-foreground mb-1">{rev.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {rev.due_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(rev.due_date).toLocaleDateString('id-ID')}
                        </span>
                      )}
                      <span>
                        Dibuat: {new Date(rev.created_at).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(rev)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(rev)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
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
            <DialogTitle>{editing ? 'Edit Revisi' : 'Buat Revisi Baru'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Judul</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Judul revisi"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Deskripsi</label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi detail..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Prioritas</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH')}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="LOW">Rendah</option>
                  <option value="MEDIUM">Sedang</option>
                  <option value="HIGH">Tinggi</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tenggat</label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
            {editing && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Revision['status'])}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="PENDING">Menunggu</option>
                  <option value="IN_PROGRESS">Dikerjakan</option>
                  <option value="COMPLETED">Selesai</option>
                  <option value="CANCELLED">Dibatalkan</option>
                </select>
              </div>
            )}
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
        title="Hapus Revisi"
        description={`Yakin ingin menghapus revisi "${deleteTarget?.title}"?`}
        confirmLabel="Hapus"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
