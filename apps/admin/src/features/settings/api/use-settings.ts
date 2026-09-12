import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiGet, apiPatch, ApiError } from '@/api/client';
import type { OrganizationSettings } from '../types';

const settingsApi = {
  get: (organizationId: string) =>
    apiGet<OrganizationSettings>(`/organizations/${organizationId}/settings`),
  update: (organizationId: string, input: Partial<OrganizationSettings>) =>
    apiPatch<OrganizationSettings>(`/organizations/${organizationId}/settings`, input),
};

export function useSettings(organizationId: string | undefined) {
  return useQuery({
    queryKey: ['settings', organizationId],
    queryFn: () => settingsApi.get(organizationId as string),
    enabled: Boolean(organizationId),
  });
}

export function useUpdateSettings(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Partial<OrganizationSettings>) => settingsApi.update(organizationId, input),
    onSuccess: (updated) => {
      queryClient.setQueryData(['settings', organizationId], updated);
      toast.success('Preferences saved.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not save preferences.');
    },
  });
}
