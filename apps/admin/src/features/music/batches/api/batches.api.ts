import { apiGet, apiPatch, apiPost } from '@/api/client';
import type { MusicBatch } from '../types';

export const musicBatchesApi = {
  list: (organizationId: string, filters?: { courseId?: string; teacherUserId?: string }) => {
    const params = new URLSearchParams();
    if (filters?.courseId) params.set('courseId', filters.courseId);
    if (filters?.teacherUserId) params.set('teacherUserId', filters.teacherUserId);
    const query = params.toString();
    return apiGet<MusicBatch[]>(
      `/organizations/${organizationId}/music-org/batches${query ? `?${query}` : ''}`,
    );
  },

  get: (organizationId: string, id: string) =>
    apiGet<MusicBatch>(`/organizations/${organizationId}/music-org/batches/${id}`),

  create: (
    organizationId: string,
    input: {
      branchId: string;
      courseId: string;
      teacherUserId?: string;
      name: string;
      capacity?: number;
      startDate: string;
      endDate?: string;
      days: string[];
      startTime: string;
      endTime: string;
    },
  ) => apiPost<MusicBatch>(`/organizations/${organizationId}/music-org/batches`, input),

  update: (
    organizationId: string,
    id: string,
    input: {
      teacherUserId?: string;
      name?: string;
      capacity?: number;
      endDate?: string;
      days?: string[];
      startTime?: string;
      endTime?: string;
      status?: string;
    },
  ) => apiPatch<MusicBatch>(`/organizations/${organizationId}/music-org/batches/${id}`, input),
};
