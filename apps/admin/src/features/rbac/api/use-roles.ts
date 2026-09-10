import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/axios';
import { RoleSummary } from '@/features/auth/types';

export const rbacApi = {
  listRoles: (organizationId: string) =>
    apiGet<RoleSummary[]>(`/organizations/${organizationId}/roles`),
};

export function useRoles(organizationId: string | undefined) {
  return useQuery({
    queryKey: ['roles', organizationId],
    queryFn: () => rbacApi.listRoles(organizationId as string),
    enabled: Boolean(organizationId),
    staleTime: 5 * 60_000, // roles rarely change — cache longer
  });
}
