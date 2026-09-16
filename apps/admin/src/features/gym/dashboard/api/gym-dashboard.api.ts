import { apiGet } from '@/api/client';
import type { GymDashboardOverview } from '../types';

export const gymDashboardApi = {
  overview: (organizationId: string) =>
    apiGet<GymDashboardOverview>(`/organizations/${organizationId}/gym/dashboard/overview`),
};
