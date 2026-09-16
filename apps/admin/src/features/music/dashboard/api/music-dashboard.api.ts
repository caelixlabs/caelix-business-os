import { apiGet } from '@/api/client';
import type { MusicDashboardOverview } from '../types';

export const musicDashboardApi = {
  overview: (organizationId: string) =>
    apiGet<MusicDashboardOverview>(`/organizations/${organizationId}/music-org/dashboard/overview`),
};
