'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Bell } from 'lucide-react';

import {
  useNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from '../api/use-notifications';
import { Spinner } from '@/components/ui/spinner';

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationBell() {
  const { data, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unreadCount = data?.unreadCount ?? 0;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-canvas hover:text-text cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-danger" />
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 w-80 rounded-lg border border-border bg-surface shadow-lg"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-text">Notifications</p>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead.mutate()}
                className="text-xs font-medium text-accent hover:underline cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center p-6">
                <Spinner />
              </div>
            ) : !data || data.items.length === 0 ? (
              <p className="p-6 text-center text-sm text-text-secondary">You&apos;re all caught up.</p>
            ) : (
              data.items.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => !notification.readAt && markRead.mutate(notification.id)}
                  className="flex w-full flex-col items-start gap-0.5 border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-canvas cursor-pointer"
                >
                  <div className="flex w-full items-center gap-2">
                    {!notification.readAt && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    )}
                    <p className="text-sm font-medium text-text">{notification.title}</p>
                  </div>
                  <p className="text-xs text-text-secondary">{notification.message}</p>
                  <p className="mt-0.5 text-[11px] text-text-secondary">
                    {timeAgo(notification.createdAt)}
                  </p>
                </button>
              ))
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
