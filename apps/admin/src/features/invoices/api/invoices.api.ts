import { apiGet, apiPatch, apiPost } from '@/api/client';
import type { Invoice, Payment } from '../types';

export const invoicesApi = {
  list: (organizationId: string, filters?: { status?: string; contactId?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status);
    if (filters?.contactId) params.set('contactId', filters.contactId);
    const query = params.toString();
    return apiGet<Invoice[]>(`/organizations/${organizationId}/invoices${query ? `?${query}` : ''}`);
  },

  get: (organizationId: string, id: string) =>
    apiGet<Invoice>(`/organizations/${organizationId}/invoices/${id}`),

  create: (
    organizationId: string,
    input: {
      contactId: string;
      branchId?: string;
      currency?: string;
      discountAmount?: number;
      dueDate?: string;
      notes?: string;
      lines: { productId?: string; description: string; quantity: number; unitPrice: number; taxRate?: number }[];
    },
  ) => apiPost<Invoice>(`/organizations/${organizationId}/invoices`, input),

  issue: (organizationId: string, id: string) =>
    apiPatch<Invoice>(`/organizations/${organizationId}/invoices/${id}/issue`),

  void: (organizationId: string, id: string) =>
    apiPatch<Invoice>(`/organizations/${organizationId}/invoices/${id}/void`),

  recordPayment: (
    organizationId: string,
    id: string,
    input: { amount: number; paymentMethod: string; referenceId?: string },
  ) => apiPost<{ invoice: Invoice; payment: Payment }>(`/organizations/${organizationId}/invoices/${id}/payments`, input),

  listPayments: (organizationId: string, id: string) =>
    apiGet<Payment[]>(`/organizations/${organizationId}/invoices/${id}/payments`),
};
