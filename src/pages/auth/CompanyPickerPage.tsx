import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Check } from 'lucide-react';

export default function CompanyPickerPage() {
  const { userCompanies, activeCompany, setActiveCompany, currentUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSelect = (company: typeof userCompanies[0]) => {
    setActiveCompany(company);
    if (currentUser?.role === 'SUPER_ADMIN') {
      navigate('/owner');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900 p-4">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Pilih Perusahaan</h1>
          <p className="text-muted-foreground mt-1">Anda terdaftar di beberapa perusahaan. Pilih salah satu untuk melanjutkan.</p>
        </div>

        <div className="space-y-3">
          {userCompanies.map(company => (
            <Card
              key={company.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                activeCompany?.id === company.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleSelect(company)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{company.name}</h3>
                  <p className="text-sm text-muted-foreground">{company.industry}</p>
                </div>
                {activeCompany?.id === company.id && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
