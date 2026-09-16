import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { gymMembersApi } from './gym-members.api';
import { ApiError } from '@/api/client';

export const gymMemberKeys = {
  list: (organizationId: string) => ['gym-members', organizationId] as const,
};

export function useGymMembers(organizationId: string | undefined) {
  return useQuery({
    queryKey: gymMemberKeys.list(organizationId ?? ''),
    queryFn: () => gymMembersApi.list(organizationId as string),
    enabled: Boolean(organizationId),
  });
}

export function useCreateGymMember(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof gymMembersApi.create>[1]) =>
      gymMembersApi.create(organizationId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: gymMemberKeys.list(organizationId) });
      toast.success('Member added.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not add member.');
    },
  });
}
