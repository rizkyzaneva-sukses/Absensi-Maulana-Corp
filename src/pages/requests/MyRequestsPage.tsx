import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { leaveRequests, overtimeRequests, corrections } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function MyRequestsPage() {
  const { currentUser, activeCompany } = useAuthStore();
  const navigate = useNavigate();
  if (!currentUser || !activeCompany) return null;

  const myLeaves = leaveRequests.filter(l => l.employee_id === currentUser.id);
  const myOvertime = overtimeRequests.filter(o => o.employee_id === currentUser.id);
  const myCorrections = corrections.filter(c => c.employee_id === currentUser.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pengajuan Saya</h1>
          <p className="text-muted-foreground">Kelola semua pengajuan cuti, lembur, dan koreksi</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="gap-1">
            <Plus size={16} /> Ajukan Cuti
          </Button>
        </div>
      </div>

      <Tabs defaultValue="leave">
        <TabsList>
          <TabsTrigger value="leave">Cuti/Izin ({myLeaves.length})</TabsTrigger>
          <TabsTrigger value="overtime">Lembur ({myOvertime.length})</TabsTrigger>
          <TabsTrigger value="correction">Koreksi ({myCorrections.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="leave">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {myLeaves.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">Belum ada pengajuan</div>
                ) : (
                  myLeaves.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">{item.type}: {item.reason}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(item.start_date)} - {formatDate(item.end_date)}</p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overtime">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {myOvertime.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">Belum ada pengajuan lembur</div>
                ) : (
                  myOvertime.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">{formatDate(item.date)} • {item.duration_hours} jam</p>
                        <p className="text-sm text-muted-foreground">{item.reason}</p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correction">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {myCorrections.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">Belum ada koreksi</div>
                ) : (
                  myCorrections.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-medium">Koreksi {formatDate(item.date)}</p>
                        <p className="text-sm text-muted-foreground">{item.reason}</p>
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
