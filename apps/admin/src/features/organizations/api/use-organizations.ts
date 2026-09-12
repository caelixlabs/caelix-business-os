import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { organizationsApi } from './organizations.api';
import { ApiError } from '@/api/client';
import type { Organization } from '../types';

export const organizationKeys = {
  detail: (id: string) => ['organizations', id] as const,
};

export function useCreateOrganization() {
  return useMutation({
    mutationFn: (input: {
      name: string;
      slug: string;
      description?: string;
      industry: Organization['industry'];
    }) => organizationsApi.create(input),
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'Could not create organization.',
      );
    },
  });
}

export function useOrganization(id: string | undefined) {
  return useQuery({
    queryKey: organizationKeys.detail(id ?? ''),
    queryFn: () => organizationsApi.get(id as string),
    enabled: Boolean(id),
  });
}

export function useUpdateOrganization(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { name?: string; description?: string }) =>
      organizationsApi.update(id, input),
    onSuccess: (updated) => {
      queryClient.setQueryData(organizationKeys.detail(id), updated);
      toast.success('Organization settings saved.');
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'Could not save changes.',
      );
    },
  });
}

export function useDeleteOrganization(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => organizationsApi.remove(id),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: organizationKeys.detail(id),
      });
      toast.success('Organization deleted.');
    },
    onError: (error) => {
      toast.error(
        error instanceof ApiError
          ? error.message
          : 'Could not delete organization.',
      );
    },
  });
}
