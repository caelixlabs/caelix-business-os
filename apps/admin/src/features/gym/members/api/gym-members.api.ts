import { apiGet, apiPatch, apiPost } from '@/api/client';
import type { GymMember } from '../types';

export const gymMembersApi = {
  list: (organizationId: string) =>
    apiGet<GymMember[]>(`/organizations/${organizationId}/gym/members`),

  get: (organizationId: string, id: string) =>
    apiGet<GymMember>(`/organizations/${organizationId}/gym/members/${id}`),

  create: (
    organizationId: string,
    input: { memberNo: string; firstName: string; lastName: string; branchId?: string; email?: string; phone?: string; notes?: string },
  ) => apiPost<GymMember>(`/organizations/${organizationId}/gym/members`, input),

  update: (organizationId: string, id: string, input: Partial<GymMember>) =>
    apiPatch<GymMember>(`/organizations/${organizationId}/gym/members/${id}`, input),
};
