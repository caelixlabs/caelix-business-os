import { apiGet, apiPatch, apiPost } from '@/api/client';
import type { Enquiry } from '../types';

export const enquiriesApi = {
  list: (organizationId: string) =>
    apiGet<Enquiry[]>(`/organizations/${organizationId}/enquiries`),

  get: (organizationId: string, id: string) =>
    apiGet<Enquiry>(`/organizations/${organizationId}/enquiries/${id}`),

  create: (
    organizationId: string,
    input: { contactId: string; branchId?: string; source: string; subject: string; description?: string },
  ) => apiPost<Enquiry>(`/organizations/${organizationId}/enquiries`, input),

  updateStatus: (organizationId: string, id: string, status: string) =>
    apiPatch<Enquiry>(`/organizations/${organizationId}/enquiries/${id}/status`, { status }),

  assign: (organizationId: string, id: string, userId: string) =>
    apiPatch<Enquiry>(`/organizations/${organizationId}/enquiries/${id}/assign`, { userId }),
};
