export type MembershipPlanStatus = 'ACTIVE' | 'INACTIVE';
export type MembershipSubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PAST_DUE';

export interface MembershipPlan {
  id: string;
  name: string;
  description?: string;
  price: string;
  currency: string;
  durationDays: number;
  sessionsIncluded?: number;
  status: MembershipPlanStatus;
}

export interface MembershipSubscription {
  id: string;
  contactId: string;
  contact?: { firstName?: string; lastName?: string };
  planId: string;
  plan: MembershipPlan;
  status: MembershipSubscriptionStatus;
  sessionsRemaining?: number;
  startsAt: string;
  expiresAt: string;
  autoRenew: boolean;
}
