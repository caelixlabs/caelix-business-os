import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@/api/client';
import { automationsApi, type CreateAutomationInput } from './automations.api';

export const automationKeys = {
  list: (organizationId: string) => ['automations', organizationId] as const,
  triggers: (organizationId: string) => ['automation-triggers', organizationId] as const,
};

export function useAutomations(organizationId: string | undefined) {
  return useQuery({
    queryKey: automationKeys.list(organizationId ?? ''),
    queryFn: () => automationsApi.list(organizationId as string),
    enabled: Boolean(organizationId),
  });
}

export function useAutomationTriggers(organizationId: string | undefined) {
  return useQuery({
    queryKey: automationKeys.triggers(organizationId ?? ''),
    queryFn: () => automationsApi.triggers(organizationId as string),
    enabled: Boolean(organizationId),
    staleTime: Infinity,
  });
}

function useAutomationMutation<TVars>(
  organizationId: string,
  mutationFn: (vars: TVars) => Promise<unknown>,
  successMessage?: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: automationKeys.list(organizationId) });
      if (successMessage) toast.success(successMessage);
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Something went wrong.');
    },
  });
}

export const useCreateAutomation = (organizationId: string) =>
  useAutomationMutation(organizationId, (input: CreateAutomationInput) => automationsApi.create(organizationId, input), 'Automation created.');

export const useToggleAutomation = (organizationId: string) =>
  useAutomationMutation(organizationId, ({ id, enabled }: { id: string; enabled: boolean }) =>
    automationsApi.update(organizationId, id, { enabled }),
  );

export const useDeleteAutomation = (organizationId: string) =>
  useAutomationMutation(organizationId, (id: string) => automationsApi.remove(organizationId, id), 'Automation deleted.');
