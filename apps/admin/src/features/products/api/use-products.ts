import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { productsApi } from './products.api';
import { ApiError } from '@/api/client';

export const productKeys = {
  list: (organizationId: string) => ['products', organizationId] as const,
  detail: (organizationId: string, id: string) => ['product', organizationId, id] as const,
};

export function useProducts(organizationId: string | undefined) {
  return useQuery({
    queryKey: productKeys.list(organizationId ?? ''),
    queryFn: () => productsApi.list(organizationId as string),
    enabled: Boolean(organizationId),
  });
}

export function useCreateProduct(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof productsApi.create>[1]) =>
      productsApi.create(organizationId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.list(organizationId) });
      toast.success('Product created.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not create product.');
    },
  });
}

export function useUpdateProduct(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string; input: Parameters<typeof productsApi.update>[2] }) =>
      productsApi.update(organizationId, params.id, params.input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.list(organizationId) });
      toast.success('Product updated.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not update product.');
    },
  });
}

export function useToggleProductStatus(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string; nextStatus: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED' }) => {
      if (params.nextStatus === 'ARCHIVED') return productsApi.archive(organizationId, params.id);
      if (params.nextStatus === 'INACTIVE') return productsApi.deactivate(organizationId, params.id);
      return productsApi.activate(organizationId, params.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.list(organizationId) });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not update product.');
    },
  });
}
