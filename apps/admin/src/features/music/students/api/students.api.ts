import { apiGet, apiPatch, apiPost } from '@/api/client';
import type { MusicStudent } from '../types';

export const musicStudentsApi = {
  list: (organizationId: string) =>
    apiGet<MusicStudent[]>(`/organizations/${organizationId}/music-org/students`),

  get: (organizationId: string, id: string) =>
    apiGet<MusicStudent>(`/organizations/${organizationId}/music-org/students/${id}`),

  create: (
    organizationId: string,
    input: {
      studentNo: string;
      firstName: string;
      lastName: string;
      branchId?: string;
      email?: string;
      phone?: string;
      instrument?: string;
      skillLevel?: string;
      guardianName?: string;
      guardianPhone?: string;
      guardianEmail?: string;
      notes?: string;
    },
  ) => apiPost<MusicStudent>(`/organizations/${organizationId}/music-org/students`, input),

  update: (
    organizationId: string,
    id: string,
    input: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      instrument?: string;
      skillLevel?: string;
      status?: string;
      guardianName?: string;
      guardianPhone?: string;
      guardianEmail?: string;
      notes?: string;
    },
  ) => apiPatch<MusicStudent>(`/organizations/${organizationId}/music-org/students/${id}`, input),
};
