import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { payrollRecords, employees } from '@/lib/mock-data';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DollarSign, FileText, Send } from 'lucide-react';

export default function PayrollPage() {
  const { activeCompany } = useAuthStore();
  const [showPreview, setShowPreview] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<typeof payrollRecords[0] | null>(null);

  const companyPayroll = payrollRecords.filter(p => p.company_id === activeCompany?.id);
  const companyEmployees = employees.filter(e => e.company_id === activeCompany?.id && e.is_active);

  const totalPayroll = companyPayroll.reduce((sum, p) => sum + p.total_pay, 0);
  const draftCount = companyPayroll.filter(p => p.status === 'DRAFT').length;
  const finalCount = companyPayroll.filter(p => p.status === 'FINALIZED').length;

  const handlePreview = (payroll: typeof payrollRecords[0]) => {
    setSelectedPayroll(payroll);
    setShowPreview(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payroll</h1>
          <p className="text-muted-foreground">Kelola penggajian karyawan {activeCompany?.name}</p>
        </div>
        <Button className="gap-2">
          <DollarSign size={16} /> Generate Payroll
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Payroll Bulan Ini</p>
            <p className="text-2xl font-bold mt-1">{formatCurrency(totalPayroll)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Draft</p>
            <p className="text-2xl font-bold mt-1">{draftCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Finalized</p>
            <p className="text-2xl font-bold mt-1">{finalCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Payroll List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daftar Payroll</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Karyawan</th>
                  <th className="text-left p-3 font-medium">Periode</th>
                  <th className="text-right p-3 font-medium">Gaji Pokok</th>
                  <th className="text-right p-3 font-medium">Lembur</th>
                  <th className="text-right p-3 font-medium">Potongan</th>
                  <th className="text-right p-3 font-medium">Total</th>
                  <th className="text-center p-3 font-medium">Status</th>
                  <th className="text-center p-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {companyPayroll.map(payroll => (
                  <tr key={payroll.id} className="hover:bg-muted/30">
                    <td className="p-3 font-medium">{payroll.employee_name}</td>
                    <td className="p-3 text-muted-foreground">{payroll.period}</td>
                    <td className="p-3 text-right">{formatCurrency(payroll.base_salary)}</td>
                    <td className="p-3 text-right">{formatCurrency(payroll.overtime_pay)}</td>
                    <td className="p-3 text-right text-red-600">-{formatCurrency(payroll.deductions)}</td>
                    <td className="p-3 text-right font-semibold">{formatCurrency(payroll.total_pay)}</td>
                    <td className="p-3 text-center"><StatusBadge status={payroll.status} /></td>
                    <td className="p-3 text-center">
                      <div className="flex gap-1 justify-center">
                        <Button size="sm" variant="ghost" onClick={() => handlePreview(payroll)} title="Preview">
                          <FileText size={14} />
                        </Button>
                        <Button size="sm" variant="ghost" title="Kirim Slip">
                          <Send size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Preview Slip Gaji</DialogTitle>
          </DialogHeader>
          {selectedPayroll && (
            <div className="space-y-4">
              <div className="text-center border-b pb-4">
                <h3 className="font-bold text-lg">{activeCompany?.name}</h3>
                <p className="text-sm text-muted-foreground">Slip Gaji - {selectedPayroll.period}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nama</span>
                  <span className="font-medium">{selectedPayroll.employee_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gaji Pokok</span>
                  <span>{formatCurrency(selectedPayroll.base_salary)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lembur</span>
                  <span>{formatCurrency(selectedPayroll.overtime_pay)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tunjangan</span>
                  <span>{formatCurrency(selectedPayroll.allowances)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Potongan</span>
                  <span>-{formatCurrency(selectedPayroll.deductions)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(selectedPayroll.total_pay)}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>Tutup</Button>
            <Button>Finalize & Kirim</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
