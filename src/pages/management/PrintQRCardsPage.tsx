import { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/PageHeader';
import { useAuthStore } from '@/stores/authStore';
import { employees } from '@/lib/mock-data';
import { getInitials } from '@/lib/utils';
import { Printer, QrCode } from 'lucide-react';

export default function PrintQRCardsPage() {
  const { activeCompany, currentUser } = useAuthStore();
  const companyId = activeCompany?.id || currentUser?.company_id || '';
  const printRef = useRef<HTMLDivElement>(null);

  const companyEmployees = employees.filter(
    (e) => e.company_id === companyId && e.is_active
  );

  const handlePrint = () => {
    if (!printRef.current) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>QR Cards - ${activeCompany?.name || 'Company'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
            .card { border: 2px solid #e5e7eb; border-radius: 12px; padding: 16px; text-align: center; page-break-inside: avoid; }
            .avatar { width: 60px; height: 60px; border-radius: 50%; background: #3b82f6; color: white; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold; margin: 0 auto 8px; }
            .name { font-size: 14px; font-weight: bold; margin-bottom: 2px; }
            .position { font-size: 11px; color: #6b7280; margin-bottom: 8px; }
            .qr-placeholder { width: 100px; height: 100px; border: 2px dashed #d1d5db; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-size: 10px; color: #9ca3af; }
            .emp-id { font-size: 10px; color: #6b7280; font-family: monospace; }
            .company { font-size: 12px; font-weight: bold; color: #3b82f6; margin-bottom: 4px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          ${printRef.current.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cetak Kartu QR"
        subtitle="Cetak kartu QR untuk absensi karyawan"
        backTo="/employees"
        action={
          <Button onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" /> Cetak
          </Button>
        }
      />

      <div ref={printRef}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {companyEmployees.map((emp) => (
            <Card key={emp.id} className="text-center">
              <CardContent className="p-4">
                <p className="text-xs font-bold text-primary mb-2">{activeCompany?.name}</p>
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mx-auto mb-2">
                  {getInitials(emp.full_name)}
                </div>
                <p className="font-medium text-sm">{emp.full_name}</p>
                <p className="text-xs text-muted-foreground mb-3">{emp.position}</p>

                {/* QR Code Placeholder */}
                <div className="w-24 h-24 border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center mx-auto mb-2">
                  <QrCode className="h-8 w-8 text-muted-foreground/50" />
                  <span className="text-[10px] text-muted-foreground mt-1">QR Code</span>
                </div>

                <p className="text-xs font-mono text-muted-foreground">{emp.employee_id}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {companyEmployees.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Tidak ada karyawan aktif</p>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Total: {companyEmployees.length} kartu • QR code akan di-generate saat integrasi backend
      </p>
    </div>
  );
}
