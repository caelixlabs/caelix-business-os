import { apiDelete, apiGet, apiPatch, apiPost } from '@/api/client';
import type { Organization } from '../types';

export const organizationsApi = {
  create: (input: {
    name: string;
    slug: string;
    description?: string;
    industry: Organization['industry'];
  }) => apiPost<Organization>('/organizations', input),

  get: (id: string) => apiGet<Organization>(`/organizations/${id}`),

  update: (id: string, input: { name?: string; description?: string }) =>
    apiPatch<Organization>(`/organizations/${id}`, input),

  remove: (id: string) => apiDelete<void>(`/organizations/${id}`),
};
