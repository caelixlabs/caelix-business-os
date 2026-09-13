import { apiGet, apiPatch, apiPost } from '@/api/client';
import type { Booking } from '../types';

export const bookingsApi = {
  list: (organizationId: string, filters?: { status?: string; contactId?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status);
    if (filters?.contactId) params.set('contactId', filters.contactId);
    const query = params.toString();
    return apiGet<Booking[]>(`/organizations/${organizationId}/bookings${query ? `?${query}` : ''}`);
  },

  get: (organizationId: string, id: string) =>
    apiGet<Booking>(`/organizations/${organizationId}/bookings/${id}`),

  create: (
    organizationId: string,
    input: { contactId: string; branchId?: string; scheduledAt: string; notes?: string },
  ) => apiPost<Booking>(`/organizations/${organizationId}/bookings`, input),

  update: (organizationId: string, id: string, input: { scheduledAt?: string; notes?: string }) =>
    apiPatch<Booking>(`/organizations/${organizationId}/bookings/${id}`, input),

  confirm: (organizationId: string, id: string) =>
    apiPatch<Booking>(`/organizations/${organizationId}/bookings/${id}/confirm`),

  cancel: (organizationId: string, id: string) =>
    apiPatch<Booking>(`/organizations/${organizationId}/bookings/${id}/cancel`),
};
