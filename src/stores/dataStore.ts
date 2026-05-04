import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Holiday, Location, Team, PayrollRecord, Notification, Employee } from '@/types';
import {
  holidays as initialHolidays,
  locations as initialLocations,
  teams as initialTeams,
  payrollRecords as initialPayroll,
  notifications as initialNotifications,
  employees as initialEmployees,
} from '@/lib/mock-data';

export interface WorkSchedule {
  id: string;
  company_id: string;
  name: string;
  description: string;
  employee_emails: string[];
  work_hours: Record<string, { start: string; end: string; is_workday: boolean }>;
  is_active: boolean;
}

export interface AuditLog {
  id: string;
  company_id: string;
  entity_type: string;
  entity_id: string;
  action: 'CREATE' | 'UPDATE' | 'AUTO_SYSTEM' | 'MANUAL_CORRECTION';
  actor_email: string;
  actor_name: string;
  actor_role: string;
  timestamp: string;
  before_data: Record<string, unknown> | null;
  after_data: Record<string, unknown> | null;
  change_reason: string;
  affected_employee_id: string;
  affected_employee_name: string;
}

export interface Revision {
  id: string;
  company_id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  assigned_to: string;
  due_date: string;
  created_at: string;
}

export interface OvertimeSettings {
  tolerance_minutes: number;
  lembur_max_minutes: number;
}

export interface PayrollRates {
  lembur_rate_per_jam: number;
}

interface DataState {
  holidays: Holiday[];
  locations: Location[];
  teams: Team[];
  payrollRecords: PayrollRecord[];
  notifications: Notification[];
  workSchedules: WorkSchedule[];
  auditLogs: AuditLog[];
  revisions: Revision[];
  employees: Employee[];
  overtimeSettings: OvertimeSettings;
  payrollRates: PayrollRates;

  // Employee actions
  addEmployee: (e: Employee) => void;
  updateEmployee: (id: string, data: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  // Holiday actions
  addHoliday: (h: Holiday) => void;
  updateHoliday: (id: string, data: Partial<Holiday>) => void;
  deleteHoliday: (id: string) => void;

  // Location actions
  addLocation: (l: Location) => void;
  updateLocation: (id: string, data: Partial<Location>) => void;
  deleteLocation: (id: string) => void;

  // Team actions
  addTeam: (t: Team) => void;
  updateTeam: (id: string, data: Partial<Team>) => void;
  deleteTeam: (id: string) => void;

  // Payroll actions
  addPayrollRecord: (p: PayrollRecord) => void;
  updatePayrollRecord: (id: string, data: Partial<PayrollRecord>) => void;
  deletePayrollRecord: (id: string) => void;
  setPayrollRecords: (records: PayrollRecord[]) => void;

  // Notification actions
  addNotification: (n: Notification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (userId: string, companyId: string) => void;

  // WorkSchedule actions
  addWorkSchedule: (ws: WorkSchedule) => void;
  updateWorkSchedule: (id: string, data: Partial<WorkSchedule>) => void;
  deleteWorkSchedule: (id: string) => void;

  // AuditLog actions
  addAuditLog: (log: AuditLog) => void;

  // Revision actions
  addRevision: (r: Revision) => void;
  updateRevision: (id: string, data: Partial<Revision>) => void;
  deleteRevision: (id: string) => void;

  // Settings actions
  setOvertimeSettings: (settings: OvertimeSettings) => void;
  setPayrollRates: (rates: PayrollRates) => void;
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      holidays: initialHolidays,
      locations: initialLocations,
      teams: initialTeams,
      payrollRecords: initialPayroll,
      notifications: initialNotifications,
      employees: initialEmployees,
      workSchedules: [],
      auditLogs: [],
      revisions: [],
      overtimeSettings: { tolerance_minutes: 15, lembur_max_minutes: 180 },
      payrollRates: { lembur_rate_per_jam: 25000 },

      // Employee
      addEmployee: (e) => set((s) => ({ employees: [...s.employees, e] })),
      updateEmployee: (id, data) =>
        set((s) => ({ employees: s.employees.map((e) => (e.id === id ? { ...e, ...data } : e)) })),
      deleteEmployee: (id) => set((s) => ({ employees: s.employees.filter((e) => e.id !== id) })),

      // Holiday
      addHoliday: (h) => set((s) => ({ holidays: [...s.holidays, h] })),
      updateHoliday: (id, data) =>
        set((s) => ({ holidays: s.holidays.map((h) => (h.id === id ? { ...h, ...data } : h)) })),
      deleteHoliday: (id) => set((s) => ({ holidays: s.holidays.filter((h) => h.id !== id) })),

      // Location
      addLocation: (l) => set((s) => ({ locations: [...s.locations, l] })),
      updateLocation: (id, data) =>
        set((s) => ({ locations: s.locations.map((l) => (l.id === id ? { ...l, ...data } : l)) })),
      deleteLocation: (id) => set((s) => ({ locations: s.locations.filter((l) => l.id !== id) })),

      // Team
      addTeam: (t) => set((s) => ({ teams: [...s.teams, t] })),
      updateTeam: (id, data) =>
        set((s) => ({ teams: s.teams.map((t) => (t.id === id ? { ...t, ...data } : t)) })),
      deleteTeam: (id) => set((s) => ({ teams: s.teams.filter((t) => t.id !== id) })),

      // Payroll
      addPayrollRecord: (p) => set((s) => ({ payrollRecords: [...s.payrollRecords, p] })),
      updatePayrollRecord: (id, data) =>
        set((s) => ({
          payrollRecords: s.payrollRecords.map((p) => (p.id === id ? { ...p, ...data } : p)),
        })),
      deletePayrollRecord: (id) =>
        set((s) => ({ payrollRecords: s.payrollRecords.filter((p) => p.id !== id) })),
      setPayrollRecords: (records) => set({ payrollRecords: records }),

      // Notification
      addNotification: (n) => set((s) => ({ notifications: [n, ...s.notifications] })),
      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
        })),
      markAllNotificationsRead: (userId, companyId) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.user_id === userId && n.company_id === companyId ? { ...n, is_read: true } : n
          ),
        })),

      // WorkSchedule
      addWorkSchedule: (ws) => set((s) => ({ workSchedules: [...s.workSchedules, ws] })),
      updateWorkSchedule: (id, data) =>
        set((s) => ({
          workSchedules: s.workSchedules.map((ws) => (ws.id === id ? { ...ws, ...data } : ws)),
        })),
      deleteWorkSchedule: (id) =>
        set((s) => ({ workSchedules: s.workSchedules.filter((ws) => ws.id !== id) })),

      // AuditLog
      addAuditLog: (log) => set((s) => ({ auditLogs: [log, ...s.auditLogs] })),

      // Revision
      addRevision: (r) => set((s) => ({ revisions: [...s.revisions, r] })),
      updateRevision: (id, data) =>
        set((s) => ({ revisions: s.revisions.map((r) => (r.id === id ? { ...r, ...data } : r)) })),
      deleteRevision: (id) => set((s) => ({ revisions: s.revisions.filter((r) => r.id !== id) })),

      // Settings
      setOvertimeSettings: (settings) => set({ overtimeSettings: settings }),
      setPayrollRates: (rates) => set({ payrollRates: rates }),
    }),
    { name: 'data-storage' }
  )
);
