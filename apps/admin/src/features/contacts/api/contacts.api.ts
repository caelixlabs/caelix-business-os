import { apiGet, apiPatch, apiPost } from '@/api/client';
import type { Contact } from '../types';

export const contactsApi = {
  list: (organizationId: string) =>
    apiGet<Contact[]>(`/organizations/${organizationId}/contacts`),

  get: (organizationId: string, id: string) =>
    apiGet<Contact>(`/organizations/${organizationId}/contacts/${id}`),

  create: (
    organizationId: string,
    input: {
      type: string;
      branchId?: string;
      firstName?: string;
      lastName?: string;
      companyName?: string;
      email?: string;
      phone?: string;
      notes?: string;
    },
  ) => apiPost<Contact>(`/organizations/${organizationId}/contacts`, input),

  update: (
    organizationId: string,
    id: string,
    input: {
      firstName?: string;
      lastName?: string;
      companyName?: string;
      email?: string;
      phone?: string;
      notes?: string;
    },
  ) => apiPatch<Contact>(`/organizations/${organizationId}/contacts/${id}`, input),

  archive: (organizationId: string, id: string) =>
    apiPatch<Contact>(`/organizations/${organizationId}/contacts/${id}/archive`),

  activate: (organizationId: string, id: string) =>
    apiPatch<Contact>(`/organizations/${organizationId}/contacts/${id}/activate`),
};
