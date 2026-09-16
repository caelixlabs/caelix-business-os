import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { membershipPlansApi, membershipSubscriptionsApi } from './memberships.api';
import { ApiError } from '@/api/client';

export const membershipKeys = {
  plans: (organizationId: string) => ['membership-plans', organizationId] as const,
  subscriptions: (organizationId: string) => ['membership-subscriptions', organizationId] as const,
};

export function useMembershipPlans(organizationId: string | undefined) {
  return useQuery({
    queryKey: membershipKeys.plans(organizationId ?? ''),
    queryFn: () => membershipPlansApi.list(organizationId as string),
    enabled: Boolean(organizationId),
  });
}

export function useCreateMembershipPlan(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof membershipPlansApi.create>[1]) =>
      membershipPlansApi.create(organizationId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: membershipKeys.plans(organizationId) });
      toast.success('Plan created.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not create plan.');
    },
  });
}

export function useMembershipSubscriptions(organizationId: string | undefined) {
  return useQuery({
    queryKey: membershipKeys.subscriptions(organizationId ?? ''),
    queryFn: () => membershipSubscriptionsApi.list(organizationId as string),
    enabled: Boolean(organizationId),
  });
}

export function useSubscribeMember(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof membershipSubscriptionsApi.subscribe>[1]) =>
      membershipSubscriptionsApi.subscribe(organizationId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: membershipKeys.subscriptions(organizationId) });
      toast.success('Subscribed.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not create subscription.');
    },
  });
}
