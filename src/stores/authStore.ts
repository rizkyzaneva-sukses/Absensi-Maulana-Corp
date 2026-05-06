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
  updatePassword: (newPassword: string) => boolean;
  customPasswords: Record<string, string>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      currentUser: null,
      userCompanies: [],
      activeCompany: null,
      customPasswords: {} as Record<string, string>,

      login: (email: string, password: string) => {
        const employee = employees.find(e => e.user_email === email && e.is_active);
        if (!employee) return false;

        const { customPasswords } = get();
        const validPassword = customPasswords[employee.id] || 'admin123';
        if (password !== validPassword) return false;

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

      updatePassword: (newPassword: string) => {
        const { currentUser } = get();
        if (!currentUser) return false;
        set((state) => ({
          customPasswords: {
            ...state.customPasswords,
            [currentUser.id]: newPassword
          }
        }));
        return true;
      },
    }),
    {
      name: 'auth-storage-v2',
    }
  )
);
