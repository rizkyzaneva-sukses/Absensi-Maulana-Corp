import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Attendance, LeaveRequest, OvertimeRequest, AttendanceCorrection } from '@/types';
import {
  attendanceRecords as initialAttendance,
  leaveRequests as initialLeave,
  overtimeRequests as initialOvertime,
  corrections as initialCorrections,
} from '@/lib/mock-data';

type CollectionName = 'attendances' | 'leaveRequests' | 'overtimeRequests' | 'corrections';
type SyncStatus = 'idle' | 'syncing' | 'online' | 'offline';

interface AttendanceData {
  attendances: Attendance[];
  leaveRequests: LeaveRequest[];
  overtimeRequests: OvertimeRequest[];
  corrections: AttendanceCorrection[];
}

interface PendingMutation {
  queueId: string;
  collection: CollectionName;
  method: 'POST' | 'PATCH';
  recordId: string;
  body: Record<string, unknown>;
  createdAt: string;
}

interface AttendanceState extends AttendanceData {
  pendingMutations: PendingMutation[];
  migrationInstanceId: string | null;
  syncStatus: SyncStatus;
  syncError: string | null;
  lastSyncedAt: string | null;
  initialized: boolean;

  initializeSync: () => Promise<void>;
  refreshFromServer: () => Promise<void>;
  uploadDeviceData: () => Promise<number>;

  addAttendance: (record: Attendance) => void;
  updateAttendance: (id: string, data: Partial<Attendance>) => void;
  addLeaveRequest: (request: LeaveRequest) => void;
  updateLeaveRequest: (id: string, data: Partial<LeaveRequest>) => void;
  addOvertimeRequest: (request: OvertimeRequest) => void;
  updateOvertimeRequest: (id: string, data: Partial<OvertimeRequest>) => void;
  addCorrection: (correction: AttendanceCorrection) => void;
  updateCorrection: (id: string, data: Partial<AttendanceCorrection>) => void;
}

const apiPaths: Record<CollectionName, string> = {
  attendances: 'attendances',
  leaveRequests: 'leave-requests',
  overtimeRequests: 'overtime-requests',
  corrections: 'corrections',
};

let initializationPromise: Promise<void> | null = null;
let flushPromise: Promise<void> | null = null;
let eventSource: EventSource | null = null;
let refreshTimer: ReturnType<typeof setTimeout> | null = null;
let fallbackRefreshTimer: ReturnType<typeof setInterval> | null = null;

function makeQueueId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(result?.error || `Server mengembalikan status ${response.status}.`);
  }
  return response.json() as Promise<T>;
}

function asAttendanceData(state: AttendanceData): AttendanceData {
  return {
    attendances: state.attendances,
    leaveRequests: state.leaveRequests,
    overtimeRequests: state.overtimeRequests,
    corrections: state.corrections,
  };
}

function readStoredAttendanceData(key: string): Partial<AttendanceData> | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return (parsed?.state || parsed) as Partial<AttendanceData>;
  } catch {
    return null;
  }
}

function mergeById<T extends { id: string }>(...collections: Array<T[] | undefined>): T[] {
  const records = new Map<string, T>();
  for (const collection of collections) {
    for (const record of collection || []) {
      if (record?.id) records.set(record.id, record);
    }
  }
  return [...records.values()];
}

function collectDeviceData(fallback: AttendanceData): AttendanceData {
  // `attendance-storage` dipakai versi awal aplikasi; v2 adalah key saat ini.
  const legacy = readStoredAttendanceData('attendance-storage');
  const current = readStoredAttendanceData('attendance-storage-v2');

  return {
    attendances: mergeById(
      legacy?.attendances,
      current?.attendances,
      fallback.attendances,
    ),
    leaveRequests: mergeById(
      legacy?.leaveRequests,
      current?.leaveRequests,
      fallback.leaveRequests,
    ),
    overtimeRequests: mergeById(
      legacy?.overtimeRequests,
      current?.overtimeRequests,
      fallback.overtimeRequests,
    ),
    corrections: mergeById(
      legacy?.corrections,
      current?.corrections,
      fallback.corrections,
    ),
  };
}

function countData(data: AttendanceData): number {
  return data.attendances.length
    + data.leaveRequests.length
    + data.overtimeRequests.length
    + data.corrections.length;
}

function applyMutation(data: AttendanceData, mutation: PendingMutation): AttendanceData {
  const current = data[mutation.collection] as unknown as Array<Record<string, unknown>>;
  const recordIndex = current.findIndex((item) => item.id === mutation.recordId);
  let next: Array<Record<string, unknown>>;

  if (mutation.method === 'POST') {
    next = recordIndex === -1
      ? [mutation.body, ...current]
      : current.map((item, index) => index === recordIndex ? { ...item, ...mutation.body } : item);
  } else {
    next = current.map((item, index) =>
      index === recordIndex ? { ...item, ...mutation.body } : item,
    );
  }

  return { ...data, [mutation.collection]: next } as AttendanceData;
}

function overlayPendingMutations(data: AttendanceData, pending: PendingMutation[]): AttendanceData {
  return pending.reduce(applyMutation, data);
}

function queueMutation(
  collection: CollectionName,
  method: PendingMutation['method'],
  recordId: string,
  body: Record<string, unknown>,
) {
  const mutation: PendingMutation = {
    queueId: makeQueueId(),
    collection,
    method,
    recordId,
    body,
    createdAt: new Date().toISOString(),
  };

  useAttendanceStore.setState((state) => ({
    ...applyMutation(asAttendanceData(state), mutation),
    pendingMutations: [...state.pendingMutations, mutation],
  }));
  void flushPendingMutations();
}

async function fetchRemoteData(): Promise<AttendanceData> {
  return requestJson<AttendanceData>('/api/sync');
}

async function refreshFromServer(): Promise<void> {
  const store = useAttendanceStore;
  store.setState({ syncStatus: 'syncing', syncError: null });
  try {
    const remote = await fetchRemoteData();
    const pending = store.getState().pendingMutations;
    store.setState({
      ...overlayPendingMutations(remote, pending),
      syncStatus: 'online',
      syncError: null,
      lastSyncedAt: new Date().toISOString(),
    });
  } catch (error) {
    store.setState({
      syncStatus: 'offline',
      syncError: error instanceof Error ? error.message : 'Tidak dapat tersambung ke server.',
    });
    throw error;
  }
}

async function uploadDeviceData(): Promise<number> {
  const store = useAttendanceStore;
  store.setState({ syncStatus: 'syncing', syncError: null });
  try {
    const deviceData = collectDeviceData(asAttendanceData(store.getState()));
    const total = countData(deviceData);
    if (total > 0) {
      await requestJson('/api/sync/import', {
        method: 'POST',
        body: JSON.stringify(deviceData),
      });
    }
    await flushPendingMutations();
    await refreshFromServer();
    return total;
  } catch (error) {
    store.setState({
      syncStatus: 'offline',
      syncError: error instanceof Error ? error.message : 'Upload data perangkat gagal.',
    });
    throw error;
  }
}

async function flushPendingMutations(): Promise<void> {
  if (flushPromise) return flushPromise;

  flushPromise = (async () => {
    const store = useAttendanceStore;
    try {
      while (store.getState().pendingMutations.length > 0) {
        const mutation = store.getState().pendingMutations[0];
        const basePath = `/api/${apiPaths[mutation.collection]}`;
        const url = mutation.method === 'PATCH' ? `${basePath}/${mutation.recordId}` : basePath;

        await requestJson(url, {
          method: mutation.method,
          body: JSON.stringify(mutation.body),
        });

        store.setState((state) => ({
          pendingMutations: state.pendingMutations.filter(
            (item) => item.queueId !== mutation.queueId,
          ),
        }));
      }
      await refreshFromServer();
    } catch (error) {
      store.setState({
        syncStatus: 'offline',
        syncError: error instanceof Error ? error.message : 'Perubahan belum dapat dikirim.',
      });
    } finally {
      flushPromise = null;
    }
  })();

  return flushPromise;
}

function scheduleRefresh() {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => {
    void refreshFromServer().catch(() => {});
  }, 150);
}

function startRealtimeConnection() {
  if (eventSource) return;
  eventSource = new EventSource('/api/events');
  eventSource.addEventListener('sync', scheduleRefresh);
  eventSource.addEventListener('ready', () => {
    useAttendanceStore.setState({ syncStatus: 'online', syncError: null });
  });
  eventSource.onerror = () => {
    useAttendanceStore.setState({
      syncStatus: 'offline',
      syncError: 'Kanal realtime terputus; server akan mencoba menyambungkan ulang.',
    });
  };

  window.addEventListener('online', () => void flushPendingMutations());
  if (!fallbackRefreshTimer) {
    fallbackRefreshTimer = setInterval(() => {
      if (document.visibilityState === 'visible') scheduleRefresh();
    }, 60_000);
  }
}

async function initializeSync(): Promise<void> {
  if (initializationPromise) return initializationPromise;

  initializationPromise = (async () => {
    const store = useAttendanceStore;
    store.setState({ syncStatus: 'syncing', syncError: null });
    try {
      const health = await requestJson<{ ok: boolean; instanceId: string }>('/api/health');
      const state = store.getState();

      // Selalu tawarkan cache perangkat ke server sebelum data server dibaca. Import bersifat
      // idempotent (ON CONFLICT DO NOTHING), sehingga aman dijalankan ulang pada setiap HP.
      const deviceData = collectDeviceData(asAttendanceData(state));
      if (countData(deviceData) > 0) {
        await requestJson('/api/sync/import', {
          method: 'POST',
          body: JSON.stringify(deviceData),
        });
      }
      store.setState({ migrationInstanceId: health.instanceId });

      await flushPendingMutations();
      await refreshFromServer();
      startRealtimeConnection();
    } catch (error) {
      store.setState({
        syncStatus: 'offline',
        syncError: error instanceof Error ? error.message : 'Sinkronisasi awal gagal.',
      });
    } finally {
      store.setState({ initialized: true });
    }
  })();

  return initializationPromise;
}

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (_set) => ({
      attendances: initialAttendance,
      leaveRequests: initialLeave,
      overtimeRequests: initialOvertime,
      corrections: initialCorrections,
      pendingMutations: [],
      migrationInstanceId: null,
      syncStatus: 'idle',
      syncError: null,
      lastSyncedAt: null,
      initialized: false,

      initializeSync,
      refreshFromServer,
      uploadDeviceData,

      addAttendance: (record) =>
        queueMutation('attendances', 'POST', record.id, record as unknown as Record<string, unknown>),
      updateAttendance: (id, data) =>
        queueMutation('attendances', 'PATCH', id, data as Record<string, unknown>),

      addLeaveRequest: (request) =>
        queueMutation('leaveRequests', 'POST', request.id, request as unknown as Record<string, unknown>),
      updateLeaveRequest: (id, data) =>
        queueMutation('leaveRequests', 'PATCH', id, data as Record<string, unknown>),

      addOvertimeRequest: (request) =>
        queueMutation('overtimeRequests', 'POST', request.id, request as unknown as Record<string, unknown>),
      updateOvertimeRequest: (id, data) =>
        queueMutation('overtimeRequests', 'PATCH', id, data as Record<string, unknown>),

      addCorrection: (correction) =>
        queueMutation('corrections', 'POST', correction.id, correction as unknown as Record<string, unknown>),
      updateCorrection: (id, data) =>
        queueMutation('corrections', 'PATCH', id, data as Record<string, unknown>),
    }),
    {
      name: 'attendance-storage-v2',
      partialize: (state) => ({
        attendances: state.attendances,
        leaveRequests: state.leaveRequests,
        overtimeRequests: state.overtimeRequests,
        corrections: state.corrections,
        pendingMutations: state.pendingMutations,
        migrationInstanceId: state.migrationInstanceId,
      }),
    },
  ),
);
