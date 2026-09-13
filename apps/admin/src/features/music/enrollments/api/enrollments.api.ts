import { apiGet, apiPatch, apiPost } from '@/api/client';
import type { MusicEnrollment } from '../types';

export const musicEnrollmentsApi = {
  list: (organizationId: string, filters?: { batchId?: string; studentId?: string }) => {
    const params = new URLSearchParams();
    if (filters?.batchId) params.set('batchId', filters.batchId);
    if (filters?.studentId) params.set('studentId', filters.studentId);
    const query = params.toString();
    return apiGet<MusicEnrollment[]>(
      `/organizations/${organizationId}/music-org/enrollments${query ? `?${query}` : ''}`,
    );
  },

  create: (
    organizationId: string,
    input: { studentId: string; batchId: string; feeAmount?: number; discountAmount?: number; notes?: string },
  ) => apiPost<MusicEnrollment>(`/organizations/${organizationId}/music-org/enrollments`, input),

  updateStatus: (organizationId: string, id: string, status: string) =>
    apiPatch<MusicEnrollment>(`/organizations/${organizationId}/music-org/enrollments/${id}/status`, {
      status,
    }),
};
