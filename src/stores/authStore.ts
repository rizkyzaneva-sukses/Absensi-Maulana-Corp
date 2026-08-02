import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Employee, Company } from '@/types';
import { employees as staticEmployees, companies } from '@/lib/mock-data';
import { useDataStore } from '@/stores/dataStore';

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
  resetPasswordWithEmail: (email: string, newPassword: string) => boolean;
}

export function findEmployeeByEmail(email: string): Employee | undefined {
  const dataStoreEmployees = useDataStore.getState().employees;
  return (
    dataStoreEmployees.find(e => e.user_email === email && e.is_active) ||
    staticEmployees.find(e => e.user_email === email && e.is_active)
  );
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      currentUser: null,
      userCompanies: [],
      activeCompany: null,

      login: (email: string, password: string) => {
        // Check dataStore first (has latest updates from owner), then fallback to static
        const employee = findEmployeeByEmail(email);
        if (!employee) return false;

        // Default password for new accounts is 'admin123' — users should change it after first login.
        const DEFAULT_PASSWORD = 'admin123';
        const validPassword = employee.password || DEFAULT_PASSWORD;
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
        useDataStore.getState().updateEmployee(currentUser.id, { password: newPassword });
        set({ currentUser: { ...currentUser, password: newPassword } });
        return true;
      },

      changeEmployeePassword: (employeeId: string, newPassword: string) => {
        const { currentUser } = get();
        // Only owner (SUPER_ADMIN, COMPANY_ADMIN, or COO) can change employee passwords
        if (!currentUser || (currentUser.role !== 'SUPER_ADMIN' && currentUser.role !== 'COMPANY_ADMIN' && currentUser.role !== 'COO')) return false;
        useDataStore.getState().updateEmployee(employeeId, { password: newPassword });
        return true;
      },

      resetPasswordWithEmail: (email: string, newPassword: string) => {
        const employee = findEmployeeByEmail(email);
        if (!employee) return false;
        useDataStore.getState().updateEmployee(employee.id, { password: newPassword });
        return true;
      },
    }),
    {
      name: 'auth-storage-v2',
    }
  )
);
