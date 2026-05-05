import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/PageHeader';
import { useAuthStore } from '@/stores/authStore';
import { employees } from '@/lib/mock-data';
import { getInitials } from '@/lib/utils';
import { Printer } from 'lucide-react';

export default function PrintQRCardsPage() {
  const { activeCompany, currentUser } = useAuthStore();
  const companyId = activeCompany?.id || currentUser?.company_id || '';
  const printRef = useRef<HTMLDivElement>(null);

  const companyEmployees = employees.filter(
    (e) => e.company_id === companyId && e.is_active
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          /* Ensure backgrounds and borders are printed */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Adjust grid for print */
          .print-grid {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 16px !important;
          }
          /* Page break to avoid splitting cards */
          .print-card {
            break-inside: avoid;
            page-break-inside: avoid;
            border: 2px solid #e5e7eb !important;
            box-shadow: none !important;
          }
        }
      `}</style>
      <div className="space-y-6">
        <div className="print:hidden">
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
        </div>

        <div id="print-area" ref={printRef}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 print-grid">
            {companyEmployees.map((emp) => {
              // Generate a QR code payload
              const qrPayload = JSON.stringify({ id: emp.id, company_id: emp.company_id });

              return (
                <Card key={emp.id} className="text-center print-card border-2">
                  <CardContent className="p-4 flex flex-col items-center">
                    <p className="text-xs font-bold text-primary mb-2 uppercase">{activeCompany?.name || 'ELYASR'}</p>
                    <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-3 shadow-sm">
                      {getInitials(emp.full_name)}
                    </div>
                    <p className="font-semibold text-sm leading-tight text-foreground">{emp.full_name}</p>
                    <p className="text-xs text-muted-foreground mb-4 font-medium">{emp.position || 'Karyawan'}</p>

                    <div className="bg-white p-2 border-2 border-muted rounded-xl mb-3 shadow-sm inline-block">
                      <QRCodeSVG 
                        value={qrPayload} 
                        size={120} 
                        level="M" 
                        includeMargin={false} 
                      />
                    </div>

                    <p className="text-[11px] font-mono font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                      {emp.employee_id}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {companyEmployees.length === 0 && (
          <div className="text-center py-12 text-muted-foreground print:hidden">
            <p>Tidak ada karyawan aktif</p>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center print:hidden">
          Total: {companyEmployees.length} kartu
        </p>
      </div>
    </>
  );
}
