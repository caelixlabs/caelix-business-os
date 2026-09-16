import { apiGet } from '@/api/client';
import type { ReportsOverview } from '../types';

export const reportsApi = {
  overview: (organizationId: string) =>
    apiGet<ReportsOverview>(`/organizations/${organizationId}/reports/overview`),
};
