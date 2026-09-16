import { useQuery } from '@tanstack/react-query';
import { gymDashboardApi } from './gym-dashboard.api';

export function useGymDashboardOverview(organizationId: string | undefined) {
  return useQuery({
    queryKey: ['gym-dashboard-overview', organizationId ?? ''],
    queryFn: () => gymDashboardApi.overview(organizationId as string),
    enabled: Boolean(organizationId),
    refetchInterval: 60_000,
  });
}
