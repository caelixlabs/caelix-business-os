import { useQuery } from '@tanstack/react-query';
import { reportsApi } from './reports.api';

export const reportKeys = {
  overview: (organizationId: string) => ['reports', 'overview', organizationId] as const,
};

export function useReportsOverview(organizationId: string | undefined) {
  return useQuery({
    queryKey: reportKeys.overview(organizationId ?? ''),
    queryFn: () => reportsApi.overview(organizationId as string),
    enabled: Boolean(organizationId),
  });
}
