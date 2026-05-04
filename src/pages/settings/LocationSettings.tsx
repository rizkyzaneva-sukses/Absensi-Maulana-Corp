import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { useAuthStore } from '@/stores/authStore';
import { useDataStore } from '@/stores/dataStore';
import { generateId } from '@/lib/attendance';
import { MapPin, Plus, Pencil, Trash2 } from 'lucide-react';
import type { Location } from '@/types';

export default function LocationSettings() {
  const { currentUser, activeCompany } = useAuthStore();
  const { locations, addLocation, updateLocation, deleteLocation } = useDataStore();
  const companyId = activeCompany?.id || currentUser?.company_id || '';

  const companyLocations = locations.filter((l) => l.company_id === companyId);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Location | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Location | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [radius, setRadius] = useState('100');

  const resetForm = () => {
    setName('');
    setAddress('');
    setLat('');
    setLng('');
    setRadius('100');
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (l: Location) => {
    setEditing(l);
    setName(l.name);
    setAddress(l.address);
    setLat(String(l.lat));
    setLng(String(l.lng));
    setRadius(String(l.radius_meters));
    setShowForm(true);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(String(pos.coords.latitude));
        setLng(String(pos.coords.longitude));
      },
      (err) => {
        console.error('Geolocation error:', err);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !lat || !lng || !radius) return;

    const data = {
      name: name.trim(),
      address: address.trim(),
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      radius_meters: parseInt(radius),
    };

    if (editing) {
      updateLocation(editing.id, data);
    } else {
      addLocation({
        id: generateId('LOC'),
        company_id: companyId,
        ...data,
      });
    }
    resetForm();
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteLocation(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lokasi Kantor"
        subtitle="Kelola lokasi yang valid untuk absensi"
        backTo="/settings"
        action={
          <Button onClick={() => setShowForm(true)} size="sm" className="gap-1">
            <Plus className="h-4 w-4" /> Tambah
          </Button>
        }
      />

      {companyLocations.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="Belum ada lokasi"
          description="Tambahkan lokasi kantor untuk validasi GPS absensi"
          action={
            <Button onClick={() => setShowForm(true)} size="sm">
              <Plus className="h-4 w-4 mr-1" /> Tambah Lokasi
            </Button>
          }
        />
      ) : (
        <div className="space-y-2">
          {companyLocations.map((loc) => (
            <Card key={loc.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-950 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{loc.name}</p>
                    <p className="text-xs text-muted-foreground">{loc.address}</p>
                    <p className="text-xs text-muted-foreground">
                      Radius: {loc.radius_meters}m • ({loc.lat.toFixed(6)}, {loc.lng.toFixed(6)})
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(loc)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(loc)}>
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
            <DialogTitle>{editing ? 'Edit Lokasi' : 'Tambah Lokasi'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Lokasi</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Kantor Pusat"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Alamat</label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Alamat lengkap"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Latitude</label>
                <Input
                  type="number"
                  step="any"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  placeholder="-6.2088"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Longitude</label>
                <Input
                  type="number"
                  step="any"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  placeholder="106.8456"
                  required
                />
              </div>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleGetCurrentLocation}>
              <MapPin className="h-4 w-4 mr-1" /> Gunakan Lokasi Saat Ini
            </Button>
            <div className="space-y-2">
              <label className="text-sm font-medium">Radius (meter)</label>
              <Input
                type="number"
                min="10"
                max="5000"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Jarak maksimal dari titik lokasi yang masih dianggap valid
              </p>
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
        title="Hapus Lokasi"
        description={`Yakin ingin menghapus lokasi "${deleteTarget?.name}"? Karyawan tidak akan bisa absensi dari lokasi ini.`}
        confirmLabel="Hapus"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
