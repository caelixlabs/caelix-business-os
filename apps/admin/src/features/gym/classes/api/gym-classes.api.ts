import { apiGet, apiPatch, apiPost } from '@/api/client';
import type { GymClass } from '../types';

export const gymClassesApi = {
  list: (organizationId: string) =>
    apiGet<GymClass[]>(`/organizations/${organizationId}/gym/classes`),

  create: (
    organizationId: string,
    input: { branchId: string; name: string; capacity?: number; startDate: string; days: string[]; startTime: string; endTime: string },
  ) => apiPost<GymClass>(`/organizations/${organizationId}/gym/classes`, input),

  update: (organizationId: string, id: string, input: Partial<GymClass>) =>
    apiPatch<GymClass>(`/organizations/${organizationId}/gym/classes/${id}`, input),
};
