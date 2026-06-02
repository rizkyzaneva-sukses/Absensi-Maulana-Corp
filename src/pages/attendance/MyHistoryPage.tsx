import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/lib/utils';

export default function MyHistoryPage() {
  const { currentUser, activeCompany } = useAuthStore();
  const { attendances, leaveRequests, overtimeRequests, corrections } = useAttendanceStore();
  const [visibleAtt, setVisibleAtt] = useState(10);
  const [visibleLeave, setVisibleLeave] = useState(10);
  const [visibleOt, setVisibleOt] = useState(10);
  const [visibleCorr, setVisibleCorr] = useState(10);

  if (!currentUser || !activeCompany) return null;

  const myAttendance = attendances
    .filter(a => a.employee_id === currentUser.id && a.company_id === activeCompany.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const myLeaves = leaveRequests
    .filter(l => l.employee_id === currentUser.id && l.company_id === activeCompany.id)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  const myOvertime = overtimeRequests
    .filter(o => o.employee_id === currentUser.id && o.company_id === activeCompany.id)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  const myCorrections = corrections
    .filter(c => c.employee_id === currentUser.id && c.company_id === activeCompany.id)
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
                  myAttendance.slice(0, visibleAtt).map(att => {
                    // Handle both ISO timestamp and HH:mm string formats
                    const formatTime = (t: string | null) => {
                      if (!t) return '-';
                      if (t.includes('T')) return new Date(t).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                      return t;
                    };
                    return (
                      <div key={att.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                        <div>
                          <p className="font-medium">{formatDate(att.date)}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatTime(att.check_in_time)} - {formatTime(att.check_out_time)}
                            {att.late_minutes > 0 && ` • Terlambat ${att.late_minutes} menit`}
                          </p>
                        </div>
                        <StatusBadge status={att.status} />
                      </div>
                    );
                  })
                )}
              </div>
              {visibleAtt < myAttendance.length && (
                <div className="p-4 flex justify-center border-t">
                  <Button variant="outline" size="sm" onClick={() => setVisibleAtt(p => p + 10)}>Tampilkan Lebih Banyak</Button>
                </div>
              )}
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
                  myLeaves.slice(0, visibleLeave).map(leave => (
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
              {visibleLeave < myLeaves.length && (
                <div className="p-4 flex justify-center border-t">
                  <Button variant="outline" size="sm" onClick={() => setVisibleLeave(p => p + 10)}>Tampilkan Lebih Banyak</Button>
                </div>
              )}
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
                  myOvertime.slice(0, visibleOt).map(ot => (
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
              {visibleOt < myOvertime.length && (
                <div className="p-4 flex justify-center border-t">
                  <Button variant="outline" size="sm" onClick={() => setVisibleOt(p => p + 10)}>Tampilkan Lebih Banyak</Button>
                </div>
              )}
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
                  myCorrections.slice(0, visibleCorr).map(corr => (
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
              {visibleCorr < myCorrections.length && (
                <div className="p-4 flex justify-center border-t">
                  <Button variant="outline" size="sm" onClick={() => setVisibleCorr(p => p + 10)}>Tampilkan Lebih Banyak</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
