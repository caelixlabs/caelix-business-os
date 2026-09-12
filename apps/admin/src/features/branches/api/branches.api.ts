import { apiDelete, apiGet, apiPatch, apiPost } from '@/api/client';
import type { Branch } from '../types';

export const branchesApi = {
  list: (organizationId: string) => apiGet<Branch[]>(`/organizations/${organizationId}/branches`),

  create: (organizationId: string, input: { name: string; code: string; description?: string }) =>
    apiPost<Branch>(`/organizations/${organizationId}/branches`, input),

  update: (id: string, input: { name: string; description?: string }) => 
    apiPatch<Branch>(`/branches/${id}`, input),

  archive: (id: string) => apiPatch<Branch>(`/branches/${id}/archive`),

  activate: (id: string) => apiPatch<Branch>(`/branches/${id}/activate`),

  remove: (id: string) => apiDelete<void>(`/branches/${id}`),
};
