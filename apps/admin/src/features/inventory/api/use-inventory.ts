import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { inventoryApi } from './inventory.api';
import { ApiError } from '@/api/client';

export const inventoryKeys = {
  list: (organizationId: string, filters?: { branchId?: string; productId?: string }) =>
    ['inventory', organizationId, filters ?? {}] as const,
};

export function useInventory(
  organizationId: string | undefined,
  filters?: { branchId?: string; productId?: string },
) {
  return useQuery({
    queryKey: inventoryKeys.list(organizationId ?? '', filters),
    queryFn: () => inventoryApi.list(organizationId as string, filters),
    enabled: Boolean(organizationId),
  });
}

export function useCreateInventoryItem(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof inventoryApi.create>[1]) =>
      inventoryApi.create(organizationId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', organizationId] });
      toast.success('Inventory record created.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not create inventory record.');
    },
  });
}

export function useAdjustStock(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string; quantityDelta: number }) =>
      inventoryApi.adjustStock(organizationId, params.id, params.quantityDelta),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', organizationId] });
      toast.success('Stock adjusted.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not adjust stock.');
    },
  });
}

export function useToggleInventoryStatus(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string; nextStatus: 'ACTIVE' | 'ARCHIVED' }) =>
      params.nextStatus === 'ARCHIVED'
        ? inventoryApi.archive(organizationId, params.id)
        : inventoryApi.activate(organizationId, params.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', organizationId] });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not update inventory record.');
    },
  });
}
