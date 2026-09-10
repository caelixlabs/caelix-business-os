import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { branchesApi } from './branches.api';
import { ApiError } from '@/lib/axios';

export const branchKeys = {
  list: (organizationId: string) => ['branches', organizationId] as const,
  detail: (id: string) => ['branch', id] as const,
};

export function useBranches(organizationId: string | undefined) {
  return useQuery({
    queryKey: branchKeys.list(organizationId ?? ''),
    queryFn: () => branchesApi.list(organizationId as string),
    enabled: Boolean(organizationId),
  });
}

export function useCreateBranch(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { name: string; code: string; description?: string }) =>
      branchesApi.create(organizationId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchKeys.list(organizationId) });
      toast.success('Branch created.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not create branch.');
    },
  });
}

export function useToggleBranchStatus(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string; nextStatus: 'ACTIVE' | 'ARCHIVED' }) =>
      params.nextStatus === 'ARCHIVED'
        ? branchesApi.archive(params.id)
        : branchesApi.activate(params.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchKeys.list(organizationId) });
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not update branch.');
    },
  });
}

export function useUpdateBranch(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      id: string;
      name: string;
      description?: string;
    }) =>
      branchesApi.update(params.id, {
        name: params.name,
        description: params.description,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: branchKeys.list(organizationId),
      });

      toast.success('Branch updated.');
    },

    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'Could not update branch.',
      );
    },
  });
}

export function useDeleteBranch(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => branchesApi.remove(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: branchKeys.list(organizationId),
      });

      toast.success('Branch deleted.');
    },

    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'Could not delete branch.',
      );
    },
  });
}