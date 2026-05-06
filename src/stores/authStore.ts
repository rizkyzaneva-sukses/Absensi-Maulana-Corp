import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Employee, Company } from '@/types';
import { employees as staticEmployees, companies } from '@/lib/mock-data';

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
  changeEmployeePassword: (employeeId: string, newPassword: string) => boolean;
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
        // Try dataStore employees first (persisted, may have updated is_active)
        const dataStoreState = JSON.parse(localStorage.getItem('data-storage') || '{}');
        const dataStoreEmployees: Employee[] = dataStoreState?.state?.employees || [];
        
        // Check dataStore first (has latest updates from owner), then fallback to static
        let employee = dataStoreEmployees.find(e => e.user_email === email && e.is_active);
        if (!employee) {
          employee = staticEmployees.find(e => e.user_email === email && e.is_active);
        }
        if (!employee) return false;

        const { customPasswords } = get();
        const defaultPasswords: Record<string, string> = {
          'asfizaneva@gmail.com': '100Jtperhari',
          'financeelyasr@gmail.com': 'sukses123',
          'creativeelyasrnew@gmail.com': 'suksesmudaaye',
          'cselyasrsukses@gmail.com': 'suksesberlimpah1',
          'annisanurafifahh@gmail.com': 'berkahsukses04',
          'yasrikhaira1@gmail.com': '100Jtperhari',
          'rizkyzaneva@gmail.com': 'admin123'
        };
        const validPassword = customPasswords[employee.id] || defaultPasswords[email] || 'admin123';
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

      changeEmployeePassword: (employeeId: string, newPassword: string) => {
        const { currentUser } = get();
        // Only owner (SUPER_ADMIN, COMPANY_ADMIN, or COO) can change employee passwords
        if (!currentUser || (currentUser.role !== 'SUPER_ADMIN' && currentUser.role !== 'COMPANY_ADMIN' && currentUser.role !== 'COO')) return false;
        set((state) => ({
          customPasswords: {
            ...state.customPasswords,
            [employeeId]: newPassword
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
