import { apiGet, apiPatch, apiPost } from '@/api/client';
import type { CheckoutInput, Sale } from '../types';

export const posApi = {
  list: (organizationId: string) => apiGet<Sale[]>(`/organizations/${organizationId}/pos/sales`),

  checkout: (organizationId: string, input: CheckoutInput) =>
    apiPost<Sale>(`/organizations/${organizationId}/pos/sales`, input),

  refund: (organizationId: string, id: string) =>
    apiPatch<Sale>(`/organizations/${organizationId}/pos/sales/${id}/refund`),
};
