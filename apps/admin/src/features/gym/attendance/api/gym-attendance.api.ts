import { apiGet, apiPost } from '@/api/client';
import type { AttendanceStatus, GymAttendanceRecord } from '../types';

export const gymAttendanceApi = {
  listByClass: (organizationId: string, classId: string, date: string) =>
    apiGet<GymAttendanceRecord[]>(
      `/organizations/${organizationId}/gym/attendance?classId=${classId}&date=${date}`,
    ),

  mark: (
    organizationId: string,
    input: { memberId: string; classId: string; date: string; status: AttendanceStatus; notes?: string },
  ) => apiPost<GymAttendanceRecord>(`/organizations/${organizationId}/gym/attendance`, input),
};
