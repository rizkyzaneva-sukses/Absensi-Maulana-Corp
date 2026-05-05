import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Attendance, LeaveRequest, OvertimeRequest, AttendanceCorrection } from '@/types';
import { attendanceRecords as initialAttendance, leaveRequests as initialLeave, overtimeRequests as initialOvertime, corrections as initialCorrections } from '@/lib/mock-data';

interface AttendanceState {
  attendances: Attendance[];
  leaveRequests: LeaveRequest[];
  overtimeRequests: OvertimeRequest[];
  corrections: AttendanceCorrection[];

  // Attendance actions
  addAttendance: (record: Attendance) => void;
  updateAttendance: (id: string, data: Partial<Attendance>) => void;

  // Leave actions
  addLeaveRequest: (request: LeaveRequest) => void;
  updateLeaveRequest: (id: string, data: Partial<LeaveRequest>) => void;

  // Overtime actions
  addOvertimeRequest: (request: OvertimeRequest) => void;
  updateOvertimeRequest: (id: string, data: Partial<OvertimeRequest>) => void;

  // Correction actions
  addCorrection: (correction: AttendanceCorrection) => void;
  updateCorrection: (id: string, data: Partial<AttendanceCorrection>) => void;
}

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set) => ({
      attendances: initialAttendance,
      leaveRequests: initialLeave,
      overtimeRequests: initialOvertime,
      corrections: initialCorrections,

      addAttendance: (record) =>
        set((s) => ({ attendances: [record, ...s.attendances] })),

      updateAttendance: (id, data) =>
        set((s) => ({
          attendances: s.attendances.map((a) =>
            a.id === id ? { ...a, ...data } : a
          ),
        })),

      addLeaveRequest: (request) =>
        set((s) => ({ leaveRequests: [request, ...s.leaveRequests] })),

      updateLeaveRequest: (id, data) =>
        set((s) => ({
          leaveRequests: s.leaveRequests.map((r) =>
            r.id === id ? { ...r, ...data } : r
          ),
        })),

      addOvertimeRequest: (request) =>
        set((s) => ({ overtimeRequests: [request, ...s.overtimeRequests] })),

      updateOvertimeRequest: (id, data) =>
        set((s) => ({
          overtimeRequests: s.overtimeRequests.map((r) =>
            r.id === id ? { ...r, ...data } : r
          ),
        })),

      addCorrection: (correction) =>
        set((s) => ({ corrections: [correction, ...s.corrections] })),

      updateCorrection: (id, data) =>
        set((s) => ({
          corrections: s.corrections.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        })),
    }),
    { name: 'attendance-storage-v2' }
  )
);
