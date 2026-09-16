import { useQuery } from '@tanstack/react-query';
import { musicDashboardApi } from './music-dashboard.api';

export function useMusicDashboardOverview(organizationId: string | undefined) {
  return useQuery({
    queryKey: ['music-dashboard-overview', organizationId ?? ''],
    queryFn: () => musicDashboardApi.overview(organizationId as string),
    enabled: Boolean(organizationId),
    refetchInterval: 60_000,
  });
}
