import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { attendanceRecords, leaveRequests, overtimeRequests, corrections } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';

export default function MyHistoryPage() {
  const { currentUser, activeCompany } = useAuthStore();
  if (!currentUser || !activeCompany) return null;

  const myAttendance = attendanceRecords
    .filter(a => a.employee_id === currentUser.id)
    .sort((a, b) => b.date.localeCompare(a.date));

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
        <h1 className="text-2xl font-bold">Riwayat Saya</h1>
        <p className="text-muted-foreground">Lihat semua riwayat absensi, cuti, lembur, dan koreksi</p>
      </div>

      <Tabs defaultValue="attendance">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="attendance">Absensi ({myAttendance.length})</TabsTrigger>
          <TabsTrigger value="leave">Cuti ({myLeaves.length})</TabsTrigger>
          <TabsTrigger value="overtime">Lembur ({myOvertime.length})</TabsTrigger>
          <TabsTrigger value="correction">Koreksi ({myCorrections.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {myAttendance.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">Belum ada data absensi</div>
                ) : (
                  myAttendance.map(att => (
                    <div key={att.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                      <div>
                        <p className="font-medium">{formatDate(att.date)}</p>
                        <p className="text-sm text-muted-foreground">
                          {att.check_in_time || '-'} - {att.check_out_time || '-'}
                          {att.late_minutes > 0 && ` • Terlambat ${att.late_minutes} menit`}
                        </p>
                      </div>
                      <StatusBadge status={att.status} />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {myLeaves.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">Belum ada pengajuan cuti</div>
                ) : (
                  myLeaves.map(leave => (
                    <div key={leave.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                      <div>
                        <p className="font-medium">{leave.type} - {leave.reason}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(leave.start_date)} s/d {formatDate(leave.end_date)}</p>
                      </div>
                      <StatusBadge status={leave.status} />
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
                  myOvertime.map(ot => (
                    <div key={ot.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                      <div>
                        <p className="font-medium">{formatDate(ot.date)} • {ot.duration_hours} jam</p>
                        <p className="text-sm text-muted-foreground">{ot.start_time} - {ot.end_time} • {ot.reason}</p>
                      </div>
                      <StatusBadge status={ot.status} />
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
                  <div className="p-8 text-center text-muted-foreground">Belum ada koreksi absensi</div>
                ) : (
                  myCorrections.map(corr => (
                    <div key={corr.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                      <div>
                        <p className="font-medium">Koreksi {formatDate(corr.date)}</p>
                        <p className="text-sm text-muted-foreground">{corr.reason}</p>
                        <p className="text-xs text-muted-foreground">
                          {corr.original_check_in}→{corr.corrected_check_in} | {corr.original_check_out || '-'}→{corr.corrected_check_out}
                        </p>
                      </div>
                      <StatusBadge status={corr.status} />
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
