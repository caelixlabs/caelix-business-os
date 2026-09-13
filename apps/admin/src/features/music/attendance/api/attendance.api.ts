import { apiGet, apiPost } from '@/api/client';
import type { MusicAttendanceRecord, MusicAttendanceStatus } from '../types';

export const musicAttendanceApi = {
  listByBatch: (organizationId: string, batchId: string, date: string) =>
    apiGet<MusicAttendanceRecord[]>(
      `/organizations/${organizationId}/music-org/attendance?batchId=${batchId}&date=${date}`,
    ),

  listByStudent: (organizationId: string, studentId: string) =>
    apiGet<MusicAttendanceRecord[]>(
      `/organizations/${organizationId}/music-org/attendance/by-student/${studentId}`,
    ),

  mark: (
    organizationId: string,
    input: { studentId: string; batchId: string; date: string; status: MusicAttendanceStatus; notes?: string },
  ) => apiPost<MusicAttendanceRecord>(`/organizations/${organizationId}/music-org/attendance`, input),
};
