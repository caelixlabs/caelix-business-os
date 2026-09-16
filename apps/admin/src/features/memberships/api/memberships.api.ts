import { apiGet, apiPatch, apiPost } from '@/api/client';
import type { MembershipPlan, MembershipSubscription } from '../types';

export const membershipPlansApi = {
  list: (organizationId: string) =>
    apiGet<MembershipPlan[]>(`/organizations/${organizationId}/membership-plans`),

  create: (
    organizationId: string,
    input: { name: string; description?: string; price: number; durationDays: number; sessionsIncluded?: number },
  ) => apiPost<MembershipPlan>(`/organizations/${organizationId}/membership-plans`, input),
};

export const membershipSubscriptionsApi = {
  list: (organizationId: string) =>
    apiGet<MembershipSubscription[]>(`/organizations/${organizationId}/membership-subscriptions`),

  subscribe: (
    organizationId: string,
    input: { contactId: string; planId: string; startsAt?: string; autoRenew?: boolean },
  ) => apiPost<MembershipSubscription>(`/organizations/${organizationId}/membership-subscriptions`, input),

  update: (organizationId: string, id: string, input: Partial<MembershipSubscription>) =>
    apiPatch<MembershipSubscription>(`/organizations/${organizationId}/membership-subscriptions/${id}`, input),
};
