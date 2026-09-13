import { apiGet, apiPatch, apiPost } from '@/api/client';
import type { InventoryItem } from '../types';

export const inventoryApi = {
  list: (organizationId: string, filters?: { branchId?: string; productId?: string }) => {
    const params = new URLSearchParams();
    if (filters?.branchId) params.set('branchId', filters.branchId);
    if (filters?.productId) params.set('productId', filters.productId);
    const query = params.toString();
    return apiGet<InventoryItem[]>(`/organizations/${organizationId}/inventory${query ? `?${query}` : ''}`);
  },

  create: (
    organizationId: string,
    input: { branchId: string; productId: string; quantityOnHand?: number; quantityReserved?: number; reorderLevel?: number },
  ) => apiPost<InventoryItem>(`/organizations/${organizationId}/inventory`, input),

  adjustStock: (organizationId: string, id: string, quantityDelta: number) =>
    apiPatch<InventoryItem>(`/organizations/${organizationId}/inventory/${id}/adjust-stock`, { quantityDelta }),

  archive: (organizationId: string, id: string) =>
    apiPatch<InventoryItem>(`/organizations/${organizationId}/inventory/${id}/archive`),

  activate: (organizationId: string, id: string) =>
    apiPatch<InventoryItem>(`/organizations/${organizationId}/inventory/${id}/activate`),
};
