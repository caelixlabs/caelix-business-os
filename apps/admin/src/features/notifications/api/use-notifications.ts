import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPatch } from '@/lib/axios';
import type { PaginatedResult } from '@/lib/types';
import type { NotificationItem } from '../types';

interface NotificationsResponse extends PaginatedResult<NotificationItem> {
  unreadCount: number;
}

const notificationsApi = {
  list: (page = 1, limit = 10) =>
    apiGet<NotificationsResponse>(`/notifications?page=${page}&limit=${limit}`),
  markRead: (id: string) => apiPatch<void>(`/notifications/${id}/read`),
  markAllRead: () => apiPatch<void>('/notifications/read-all'),
};

const notificationKeys = { list: ['notifications'] as const };

export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.list,
    queryFn: () => notificationsApi.list(),
    // Lightweight polling keeps the bell reasonably fresh without
    // needing a websocket for this phase.
    refetchInterval: 30_000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.list }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.list }),
  });
}
