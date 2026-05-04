import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useDataStore } from '@/stores/dataStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { EmptyState } from '@/components/common/EmptyState';
import { generateId } from '@/lib/attendance';
import { formatCurrency, getInitials } from '@/lib/utils';
import { Plus, Search, Pencil, Trash2, Users, Eye, X } from 'lucide-react';
import type { Employee, Role } from '@/types';

export default function EmployeesPage() {
  const { activeCompany } = useAuthStore();
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useDataStore();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [viewDetail, setViewDetail] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  const companyId = activeCompany?.id || '';

  const companyEmployees = employees
    .filter((e) => e.company_id === companyId)
    .filter(
      (e) =>
        e.full_name.toLowerCase().includes(search.toLowerCase()) ||
        e.position.toLowerCase().includes(search.toLowerCase()) ||
        e.employee_id.toLowerCase().includes(search.toLowerCase())
    );

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    employee_id: '',
    user_email: '',
    phone: '',
    position: '',
    department: '',
    role: 'KARYAWAN' as Role,
    join_date: '',
    base_salary: '',
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      full_name: '',
      employee_id: '',
      user_email: '',
      phone: '',
      position: '',
      department: '',
      role: 'KARYAWAN',
      join_date: '',
      base_salary: '',
      is_active: true,
    });
    setEditing(null);
    setShowForm(false);
  };

  const openAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (emp: Employee) => {
    setEditing(emp);
    setFormData({
      full_name: emp.full_name,
      employee_id: emp.employee_id,
      user_email: emp.user_email,
      phone: emp.phone,
      position: emp.position,
      department: emp.department,
      role: emp.role,
      join_date: emp.join_date,
      base_salary: String(emp.base_salary),
      is_active: emp.is_active,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim() || !formData.employee_id.trim()) return;

    if (editing) {
      updateEmployee(editing.id, {
        full_name: formData.full_name.trim(),
        employee_id: formData.employee_id.trim(),
        user_email: formData.user_email.trim(),
        phone: formData.phone.trim(),
        position: formData.position.trim(),
        department: formData.department.trim(),
        role: formData.role,
        join_date: formData.join_date,
        base_salary: parseInt(formData.base_salary) || 0,
        is_active: formData.is_active,
      });
    } else {
      const newEmployee: Employee = {
        id: generateId('EMP'),
        company_id: companyId,
        full_name: formData.full_name.trim(),
        employee_id: formData.employee_id.trim(),
        user_email: formData.user_email.trim(),
        phone: formData.phone.trim(),
        position: formData.position.trim(),
        department: formData.department.trim(),
        team_id: '',
        role: formData.role,
        join_date: formData.join_date || new Date().toISOString().split('T')[0],
        photo_url: '',
        is_active: formData.is_active,
        base_salary: parseInt(formData.base_salary) || 0,
        created_at: new Date().toISOString(),
      };
      addEmployee(newEmployee);
    }
    resetForm();
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteEmployee(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Karyawan</h1>
          <p className="text-muted-foreground">
            {companyEmployees.length} karyawan di {activeCompany?.name}
          </p>
        </div>
        <Button onClick={openAdd} className="gap-2">
          <Plus size={16} /> Tambah Karyawan
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cari nama, posisi, ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Employee Grid */}
      {companyEmployees.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Belum ada karyawan"
          description={search ? 'Tidak ditemukan karyawan yang sesuai' : 'Tambahkan karyawan pertama'}
          action={
            !search ? (
              <Button onClick={openAdd} size="sm">
                <Plus className="h-4 w-4 mr-1" /> Tambah Karyawan
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companyEmployees.map((emp) => (
            <Card key={emp.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    {getInitials(emp.full_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{emp.full_name}</p>
                    <p className="text-sm text-muted-foreground">{emp.position}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      emp.is_active
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {emp.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">ID</p>
                    <p className="font-medium">{emp.employee_id}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Gaji</p>
                    <p className="font-medium">{formatCurrency(emp.base_salary)}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-1 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => setViewDetail(emp)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openEdit(emp)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(emp)}>
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
            <DialogTitle>{editing ? 'Edit Karyawan' : 'Tambah Karyawan Baru'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium">Nama Lengkap *</label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => updateField('full_name', e.target.value)}
                  placeholder="Nama lengkap karyawan"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">ID Karyawan *</label>
                <Input
                  value={formData.employee_id}
                  onChange={(e) => updateField('employee_id', e.target.value)}
                  placeholder="EMP-001"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={formData.user_email}
                  onChange={(e) => updateField('user_email', e.target.value)}
                  placeholder="email@company.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">No. Telepon</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Posisi/Jabatan</label>
                <Input
                  value={formData.position}
                  onChange={(e) => updateField('position', e.target.value)}
                  placeholder="Staff IT"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Departemen</label>
                <Input
                  value={formData.department}
                  onChange={(e) => updateField('department', e.target.value)}
                  placeholder="IT"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => updateField('role', e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="KARYAWAN">Karyawan</option>
                  <option value="MANAGER">Manager</option>
                  <option value="COMPANY_ADMIN">Admin Perusahaan</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tanggal Bergabung</label>
                <Input
                  type="date"
                  value={formData.join_date}
                  onChange={(e) => updateField('join_date', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Gaji Pokok (Rp)</label>
                <Input
                  type="number"
                  min="0"
                  step="100000"
                  value={formData.base_salary}
                  onChange={(e) => updateField('base_salary', e.target.value)}
                  placeholder="5000000"
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => updateField('is_active', e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="is_active" className="text-sm font-medium">
                  Status Aktif
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>
                Batal
              </Button>
              <Button type="submit">{editing ? 'Simpan Perubahan' : 'Tambah Karyawan'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={!!viewDetail} onOpenChange={(open) => !open && setViewDetail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Karyawan</DialogTitle>
          </DialogHeader>
          {viewDetail && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  {getInitials(viewDetail.full_name)}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{viewDetail.full_name}</h3>
                  <p className="text-muted-foreground">{viewDetail.position}</p>
                  <Badge variant={viewDetail.is_active ? 'default' : 'secondary'}>
                    {viewDetail.is_active ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">ID Karyawan</p>
                  <p className="font-medium">{viewDetail.employee_id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{viewDetail.user_email || '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Telepon</p>
                  <p className="font-medium">{viewDetail.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Departemen</p>
                  <p className="font-medium">{viewDetail.department || '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Role</p>
                  <p className="font-medium">{viewDetail.role}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tanggal Bergabung</p>
                  <p className="font-medium">
                    {viewDetail.join_date
                      ? new Date(viewDetail.join_date).toLocaleDateString('id-ID')
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gaji Pokok</p>
                  <p className="font-medium">{formatCurrency(viewDetail.base_salary)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Dibuat</p>
                  <p className="font-medium">
                    {new Date(viewDetail.created_at).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDetail(null)}>
              Tutup
            </Button>
            <Button
              onClick={() => {
                if (viewDetail) openEdit(viewDetail);
                setViewDetail(null);
              }}
            >
              <Pencil className="h-4 w-4 mr-1" /> Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Hapus Karyawan"
        description={`Yakin ingin menghapus karyawan "${deleteTarget?.full_name}"? Data yang terkait mungkin terpengaruh.`}
        confirmLabel="Hapus"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
