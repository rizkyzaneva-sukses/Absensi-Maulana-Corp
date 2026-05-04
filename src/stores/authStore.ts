import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Employee, Company } from '@/types';
import { employees, companies } from '@/lib/mock-data';

interface AuthState {
  isAuthenticated: boolean;
  currentUser: Employee | null;
  userCompanies: Company[];
  activeCompany: Company | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setActiveCompany: (company: Company) => void;
  switchCompany: (companyId: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      currentUser: null,
      userCompanies: [],
      activeCompany: null,

      login: (email: string, _password: string) => {
        const employee = employees.find(e => e.user_email === email && e.is_active);
        if (!employee) return false;

        let userCompanies: Company[];
        if (employee.role === 'SUPER_ADMIN') {
          userCompanies = companies.filter(c => c.is_active);
        } else {
          userCompanies = companies.filter(c => c.id === employee.company_id && c.is_active);
        }

        if (userCompanies.length === 0) return false;

        set({
          isAuthenticated: true,
          currentUser: employee,
          userCompanies,
          activeCompany: userCompanies[0],
        });
        return true;
      },

      logout: () => {
        set({
          isAuthenticated: false,
          currentUser: null,
          userCompanies: [],
          activeCompany: null,
        });
      },

      setActiveCompany: (company: Company) => {
        set({ activeCompany: company });
      },

      switchCompany: (companyId: string) => {
        const { userCompanies } = get();
        const company = userCompanies.find(c => c.id === companyId);
        if (company) {
          set({ activeCompany: company });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
