import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { posApi } from './pos.api';
import type { CheckoutInput } from '../types';
import { ApiError } from '@/api/client';

export const posKeys = {
  list: (organizationId: string) => ['pos-sales', organizationId] as const,
};

export function useSales(organizationId: string | undefined) {
  return useQuery({
    queryKey: posKeys.list(organizationId ?? ''),
    queryFn: () => posApi.list(organizationId as string),
    enabled: Boolean(organizationId),
  });
}

export function useCheckout(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CheckoutInput) => posApi.checkout(organizationId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: posKeys.list(organizationId) });
      toast.success('Sale completed.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not complete sale.');
    },
  });
}

export function useRefundSale(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => posApi.refund(organizationId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: posKeys.list(organizationId) });
      toast.success('Sale refunded.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not refund sale.');
    },
  });
}
