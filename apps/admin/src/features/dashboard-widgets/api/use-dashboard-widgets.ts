import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { dashboardWidgetsApi } from './dashboard-widgets.api';
import type { DashboardWidgetPrefs } from '../types';
import { ApiError } from '@/api/client';

export const dashboardWidgetsKeys = {
  get: (organizationId: string) => ['dashboard-widgets', organizationId] as const,
};

export function useDashboardWidgets(organizationId: string | undefined) {
  return useQuery({
    queryKey: dashboardWidgetsKeys.get(organizationId ?? ''),
    queryFn: () => dashboardWidgetsApi.get(organizationId as string),
    enabled: Boolean(organizationId),
  });
}

export function useUpdateDashboardWidgets(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (widgets: DashboardWidgetPrefs) => dashboardWidgetsApi.update(organizationId, widgets),
    onSuccess: (data) => {
      queryClient.setQueryData(dashboardWidgetsKeys.get(organizationId), data);
      toast.success('Dashboard updated.');
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not update dashboard widgets.');
    },
  });
}
