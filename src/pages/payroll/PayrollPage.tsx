import { useState, useMemo } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useDataStore } from '@/stores/dataStore';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { generateCompanyPayroll, exportPayrollToCSV, downloadCSV } from '@/lib/payroll';
import { getWorkingDaysInMonth } from '@/lib/attendance';
import { formatCurrency } from '@/lib/utils';
import { Settings, Download, RefreshCw, Pencil, Check, Trash2 } from 'lucide-react';
import type { PayrollRecord } from '@/types';

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function PayrollPage() {
  const { activeCompany } = useAuthStore();
  const { employees, holidays, payrollRecords, setPayrollRecords, updatePayrollRecord, deletePayrollRecord, overtimeSettings } = useDataStore();
  const { attendances } = useAttendanceStore();

  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [showSettings, setShowSettings] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PayrollRecord | null>(null);
  const [editForm, setEditForm] = useState({ bonus: '0', deductions: '0' });

  const companyId = activeCompany?.id || '';

  // Filter payroll records for selected period
  const period = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`;
  const periodRecords = payrollRecords.filter(
    (p) => p.company_id === companyId && p.period === period
  );

  // Calculate working days for the selected month
  const workingDays = useMemo(
    () => getWorkingDaysInMonth(selectedYear, selectedMonth, holidays, companyId),
    [selectedYear, selectedMonth, holidays, companyId]
  );

  // Summary totals
  const totals = useMemo(() => {
    return periodRecords.reduce(
      (acc, r) => ({
        gajiPokok: acc.gajiPokok + r.base_salary,
        transport: acc.transport + r.transport,
        makan: acc.makan + r.uang_makan,
        lembur: acc.lembur + r.overtime_pay,
        bonus: acc.bonus + r.bonus,
        potongan: acc.potongan + r.deductions,
        gajiBersih: acc.gajiBersih + r.total_pay,
      }),
      { gajiPokok: 0, transport: 0, makan: 0, lembur: 0, bonus: 0, potongan: 0, gajiBersih: 0 }
    );
  }, [periodRecords]);

  // Generate payroll
  const handleGenerate = () => {
    const companyEmps = employees.filter((e) => e.company_id === companyId && e.is_active);
    if (companyEmps.length === 0) return;

    const newRecords = generateCompanyPayroll(
      employees,
      attendances,
      holidays,
      selectedYear,
      selectedMonth,
      companyId,
      payrollRecords,
      overtimeSettings
    );

    // Replace existing records for this period, keep others
    const otherRecords = payrollRecords.filter(
      (p) => !(p.company_id === companyId && p.period === period)
    );
    setPayrollRecords([...otherRecords, ...newRecords]);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (periodRecords.length === 0) return;
    const csv = exportPayrollToCSV(periodRecords);
    downloadCSV(csv, `payroll_${activeCompany?.name || 'company'}_${period}.csv`);
  };

  // Finalize a record
  const handleFinalize = (record: PayrollRecord) => {
    updatePayrollRecord(record.id, {
      status: 'FINALIZED',
      finalized_at: new Date().toISOString(),
    });
  };

  // Delete a record
  const handleDelete = (id: string) => {
    deletePayrollRecord(id);
  };

  // Open edit dialog
  const handleEdit = (record: PayrollRecord) => {
    setEditingRecord(record);
    setEditForm({
      bonus: String(record.bonus),
      deductions: String(record.deductions),
    });
  };

  // Save edit
  const handleSaveEdit = () => {
    if (!editingRecord) return;
    const newBonus = parseInt(editForm.bonus) || 0;
    const newDeductions = parseInt(editForm.deductions) || 0;
    // Recalculate total_pay
    const totalPay = editingRecord.base_salary + editingRecord.transport + editingRecord.uang_makan + editingRecord.overtime_pay + newBonus - newDeductions;
    updatePayrollRecord(editingRecord.id, {
      bonus: newBonus,
      deductions: newDeductions,
      total_pay: Math.max(0, totalPay),
    });
    setEditingRecord(null);
  };

  // Format number with dots (Indonesian format)
  const formatNum = (num: number) => {
    return num.toLocaleString('id-ID');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Data Payroll</h1>
          <p className="text-muted-foreground">Kelola data gaji karyawan</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowSettings(true)} className="gap-2">
            <Settings size={16} /> Setting
          </Button>
          <Button variant="outline" onClick={handleExportCSV} className="gap-2">
            <Download size={16} /> Export CSV
          </Button>
          <Button onClick={handleGenerate} className="gap-2">
            <RefreshCw size={16} /> Generate Payroll
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="p-4 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Tahun:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              {[2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Bulan:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              {MONTHS.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          <span className="text-sm text-muted-foreground">
            Hari kerja: <strong>{workingDays} hari</strong>
          </span>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Total Gaji Pokok</p>
            <p className="text-sm font-bold text-yellow-500 mt-1">{formatNum(totals.gajiPokok)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Total Transport</p>
            <p className="text-sm font-bold text-green-500 mt-1">{formatNum(totals.transport)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Total Makan</p>
            <p className="text-sm font-bold text-orange-500 mt-1">{formatNum(totals.makan)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Total Lembur</p>
            <p className="text-sm font-bold text-emerald-500 mt-1">{formatNum(totals.lembur)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Total Bonus</p>
            <p className="text-sm font-bold text-purple-500 mt-1">{formatNum(totals.bonus)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Total Potongan</p>
            <p className="text-sm font-bold text-red-500 mt-1">{formatNum(totals.potongan)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">Total Gaji Bersih</p>
            <p className="text-sm font-bold text-blue-500 mt-1">{formatNum(totals.gajiBersih)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left p-3 font-medium w-8">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="text-left p-3 font-medium">NIK</th>
                  <th className="text-left p-3 font-medium">Nama</th>
                  <th className="text-right p-3 font-medium">Gaji Pokok</th>
                  <th className="text-center p-3 font-medium">Hadir</th>
                  <th className="text-right p-3 font-medium">Transport</th>
                  <th className="text-right p-3 font-medium">Makan</th>
                  <th className="text-right p-3 font-medium">Lembur</th>
                  <th className="text-right p-3 font-medium">Bonus</th>
                  <th className="text-right p-3 font-medium">Potongan</th>
                  <th className="text-right p-3 font-medium">Gaji Bersih</th>
                  <th className="text-center p-3 font-medium">Status</th>
                  <th className="text-center p-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {periodRecords.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="p-8 text-center text-muted-foreground">
                      Belum ada data payroll untuk periode ini. Klik "Generate Payroll" untuk membuat.
                    </td>
                  </tr>
                ) : (
                  periodRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-muted/30">
                      <td className="p-3">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="p-3 font-mono text-xs">{record.employee_nik}</td>
                      <td className="p-3 font-medium">{record.employee_name}</td>
                      <td className="p-3 text-right">{formatNum(record.base_salary)}</td>
                      <td className="p-3 text-center">
                        {record.days_present}/{record.working_days}
                      </td>
                      <td className="p-3 text-right">{formatNum(record.transport)}</td>
                      <td className="p-3 text-right">{formatNum(record.uang_makan)}</td>
                      <td className="p-3 text-right">{formatNum(record.overtime_pay)}</td>
                      <td className="p-3 text-right">{formatNum(record.bonus)}</td>
                      <td className="p-3 text-right">-{formatNum(record.deductions)}</td>
                      <td className="p-3 text-right font-bold">{formatNum(record.total_pay)}</td>
                      <td className="p-3 text-center">
                        <Badge
                          variant={record.status === 'FINALIZED' ? 'default' : 'secondary'}
                          className={
                            record.status === 'DRAFT'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : record.status === 'FINALIZED'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : ''
                          }
                        >
                          {record.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1 justify-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            title="Edit"
                            className="h-7 w-7 p-0"
                            onClick={() => handleEdit(record)}
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            title="Finalize"
                            className="h-7 w-7 p-0 text-green-600"
                            onClick={() => handleFinalize(record)}
                            disabled={record.status === 'FINALIZED'}
                          >
                            <Check size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            title="Hapus"
                            className="h-7 w-7 p-0 text-red-600"
                            onClick={() => handleDelete(record.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Payroll Dialog */}
      <Dialog open={!!editingRecord} onOpenChange={(open) => !open && setEditingRecord(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Payroll - {editingRecord?.employee_name}</DialogTitle>
          </DialogHeader>
          {editingRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">NIK</p>
                  <p className="font-medium">{editingRecord.employee_nik}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gaji Pokok</p>
                  <p className="font-medium">{formatCurrency(editingRecord.base_salary)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Transport</p>
                  <p className="font-medium">{formatCurrency(editingRecord.transport)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Makan</p>
                  <p className="font-medium">{formatCurrency(editingRecord.uang_makan)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Lembur</p>
                  <p className="font-medium">{formatCurrency(editingRecord.overtime_pay)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Hadir</p>
                  <p className="font-medium">{editingRecord.days_present}/{editingRecord.working_days}</p>
                </div>
              </div>

              <div className="space-y-3 border-t pt-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bonus (Rp)</label>
                  <Input
                    type="number"
                    min="0"
                    step="10000"
                    value={editForm.bonus}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, bonus: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Potongan (Rp)</label>
                  <Input
                    type="number"
                    min="0"
                    step="10000"
                    value={editForm.deductions}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, deductions: e.target.value }))}
                  />
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between text-sm font-bold">
                  <span>Estimasi Gaji Bersih:</span>
                  <span>
                    {formatCurrency(
                      Math.max(
                        0,
                        editingRecord.base_salary +
                          editingRecord.transport +
                          editingRecord.uang_makan +
                          editingRecord.overtime_pay +
                          (parseInt(editForm.bonus) || 0) -
                          (parseInt(editForm.deductions) || 0)
                      )
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingRecord(null)}>Batal</Button>
            <Button onClick={handleSaveEdit}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Pengaturan Payroll</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Pengaturan gaji per karyawan dapat diubah di halaman Karyawan (edit karyawan).
            </p>
            <div className="text-sm space-y-2">
              <p><strong>Rate Lembur:</strong> gaji_pokok / (hari_kerja × 8) per jam (per karyawan)</p>
              <p><strong>Toleransi Lembur:</strong> {overtimeSettings.tolerance_minutes} menit</p>
              <p><strong>Maks Lembur/hari:</strong> {overtimeSettings.lembur_max_minutes} menit</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettings(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
