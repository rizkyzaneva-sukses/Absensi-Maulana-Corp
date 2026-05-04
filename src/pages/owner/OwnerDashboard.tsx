import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { companies, employees, attendanceRecords, payrollRecords } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';
import { Building2, Users, DollarSign, Clock, ArrowRight } from 'lucide-react';

export default function OwnerDashboard() {
  const { switchCompany } = useAuthStore();
  const navigate = useNavigate();

  const companyStats = companies.map(company => {
    const companyEmployees = employees.filter(e => e.company_id === company.id && e.is_active);
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAttendance = attendanceRecords.filter(a => a.company_id === company.id && a.date === todayStr);
    const presentCount = todayAttendance.filter(a => ['HADIR', 'TERLAMBAT'].includes(a.status)).length;
    const totalPayroll = payrollRecords
      .filter(p => p.company_id === company.id)
      .reduce((sum, p) => sum + p.total_pay, 0);

    return {
      ...company,
      employeeCount: companyEmployees.length,
      presentToday: presentCount,
      totalPayroll,
    };
  });

  const totalEmployees = companyStats.reduce((sum, c) => sum + c.employeeCount, 0);
  const totalPayroll = companyStats.reduce((sum, c) => sum + c.totalPayroll, 0);

  const handleEnterCompany = (companyId: string) => {
    switchCompany(companyId);
    navigate('/dashboard');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Owner Dashboard</h1>
        <p className="text-muted-foreground">Ringkasan semua perusahaan Maulana Corp</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Perusahaan</p>
                <p className="text-2xl font-bold">{companies.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Karyawan</p>
                <p className="text-2xl font-bold">{totalEmployees}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Payroll (Bulan Ini)</p>
                <p className="text-2xl font-bold">{formatCurrency(totalPayroll)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Company Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {companyStats.map(company => (
          <Card key={company.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{company.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{company.industry}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${company.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  {company.is_active ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-lg font-semibold">{company.employeeCount}</p>
                  <p className="text-xs text-muted-foreground">Karyawan</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">{company.presentToday}</p>
                  <p className="text-xs text-muted-foreground">Hadir Hari Ini</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">{formatCurrency(company.totalPayroll)}</p>
                  <p className="text-xs text-muted-foreground">Payroll</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleEnterCompany(company.id)}
              >
                Masuk ke {company.name}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
