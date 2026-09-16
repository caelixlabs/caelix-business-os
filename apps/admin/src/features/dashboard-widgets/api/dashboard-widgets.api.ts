import { apiGet, apiPatch } from '@/api/client';
import type { DashboardWidgetPrefs } from '../types';

export const dashboardWidgetsApi = {
  get: (organizationId: string) =>
    apiGet<DashboardWidgetPrefs>(`/organizations/${organizationId}/dashboard-widgets`),

  update: (organizationId: string, widgets: DashboardWidgetPrefs) =>
    apiPatch<DashboardWidgetPrefs>(`/organizations/${organizationId}/dashboard-widgets`, { widgets }),
};
