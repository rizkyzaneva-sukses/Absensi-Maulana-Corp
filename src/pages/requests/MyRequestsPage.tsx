import { useAuthStore } from '@/stores/authStore';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { useDataStore } from '@/stores/dataStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatDate } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Clock, FileEdit } from 'lucide-react';

export default function MyRequestsPage() {
  const { currentUser, activeCompany } = useAuthStore();
  const { leaveRequests, overtimeRequests, corrections } = useAttendanceStore();
  const { employees } = useDataStore();
  const navigate = useNavigate();

  if (!currentUser || !activeCompany) return null;

  const employee = employees.find(e => e.id === currentUser.id);

  const myLeaves = leaveRequests
    .filter(l => l.employee_id === currentUser.id)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  const myOvertime = overtimeRequests
    .filter(o => o.employee_id === currentUser.id)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  const myCorrections = corrections
    .filter(c => c.employee_id === currentUser.id)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pengajuan Saya</h1>
        <p className="text-muted-foreground">Kelola semua pengajuan cuti, lembur, dan koreksi</p>
      </div>

      {/* Leave Balance Summary */}
      {employee && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                <p className="text-2xl font-bold text-blue-600">{employee.cuti_tahunan ?? 0}</p>
                <p className="text-xs text-muted-foreground">Sisa Cuti Tahunan</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30">
                <p className="text-2xl font-bold text-green-600">{employee.cuti_sakit ?? 0}</p>
                <p className="text-xs text-muted-foreground">Sisa Cuti Sakit</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick action buttons */}
      <div className="grid grid-cols-3 gap-3">
        <Button
          variant="outline"
          className="flex flex-col h-auto py-4 gap-1"
          onClick={() => navigate('/requests/leave')}
        >
          <Calendar className="w-5 h-5 text-primary" />
          <span className="text-xs font-medium">Ajukan Cuti/Izin</span>
        </Button>
        <Button
          variant="outline"
          className="flex flex-col h-auto py-4 gap-1"
          onClick={() => navigate('/requests/overtime')}
        >
          <Clock className="w-5 h-5 text-amber-500" />
          <span className="text-xs font-medium">Ajukan Lembur</span>
        </Button>
        <Button
          variant="outline"
          className="flex flex-col h-auto py-4 gap-1"
          onClick={() => navigate('/requests/correction')}
        >
          <FileEdit className="w-5 h-5 text-blue-500" />
          <span className="text-xs font-medium">Koreksi Absensi</span>
        </Button>
      </div>

      <Tabs defaultValue="leave">
        <TabsList className="w-full">
          <TabsTrigger value="leave" className="flex-1">
            Cuti/Izin
            {myLeaves.length > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-[10px] rounded-full bg-primary text-primary-foreground">
                {myLeaves.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="overtime" className="flex-1">
            Lembur
            {myOvertime.length > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-[10px] rounded-full bg-primary text-primary-foreground">
                {myOvertime.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="correction" className="flex-1">
            Koreksi
            {myCorrections.length > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-[10px] rounded-full bg-primary text-primary-foreground">
                {myCorrections.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Leave/Izin Tab */}
        <TabsContent value="leave">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {myLeaves.length === 0 ? (
                  <div className="p-10 text-center text-muted-foreground">
                    <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="font-medium">Belum ada pengajuan</p>
                    <p className="text-sm mt-1">Klik "Ajukan Cuti/Izin" di atas</p>
                    <Button size="sm" className="mt-3" onClick={() => navigate('/requests/leave')}>
                      <Plus size={14} className="mr-1" /> Buat Pengajuan
                    </Button>
                  </div>
                ) : (
                  myLeaves.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4">
                      <div className="min-w-0 flex-1 mr-3">
                        <p className="font-medium">
                          {item.type === 'CUTI' ? '🏖️ Cuti' : item.type === 'IZIN' ? '📋 Izin' : '🏥 Sakit'}
                          {item.reason && <span className="ml-1 font-normal text-muted-foreground">— {item.reason}</span>}
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {formatDate(item.start_date)}
                          {item.end_date && item.end_date !== item.start_date && ` s/d ${formatDate(item.end_date)}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Diajukan: {new Date(item.created_at).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overtime Tab */}
        <TabsContent value="overtime">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {myOvertime.length === 0 ? (
                  <div className="p-10 text-center text-muted-foreground">
                    <Clock className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="font-medium">Belum ada pengajuan lembur</p>
                    <Button size="sm" className="mt-3" onClick={() => navigate('/requests/overtime')}>
                      <Plus size={14} className="mr-1" /> Ajukan Lembur
                    </Button>
                  </div>
                ) : (
                  myOvertime.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4">
                      <div className="min-w-0 flex-1 mr-3">
                        <p className="font-medium">⏰ Lembur {formatDate(item.date)}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {item.start_time} – {item.end_time} • <strong>{item.duration_hours} jam</strong>
                        </p>
                        <p className="text-sm text-muted-foreground truncate">{item.reason}</p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Correction Tab */}
        <TabsContent value="correction">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {myCorrections.length === 0 ? (
                  <div className="p-10 text-center text-muted-foreground">
                    <FileEdit className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="font-medium">Belum ada koreksi absensi</p>
                    <Button size="sm" className="mt-3" onClick={() => navigate('/requests/correction')}>
                      <Plus size={14} className="mr-1" /> Ajukan Koreksi
                    </Button>
                  </div>
                ) : (
                  myCorrections.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4">
                      <div className="min-w-0 flex-1 mr-3">
                        <p className="font-medium">✏️ Koreksi {formatDate(item.date)}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Check-in: {item.corrected_check_in?.split('T')[1]?.slice(0, 5) || item.corrected_check_in} •
                          Check-out: {item.corrected_check_out?.split('T')[1]?.slice(0, 5) || item.corrected_check_out}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">{item.reason}</p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
