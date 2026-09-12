'use client';

import { Button } from '@/components/ui/button';
import type { NotificationItem } from '@/features/notifications/types';

export function NotificationItem({ notification, onRead, pending }: { notification: NotificationItem; onRead: () => void; pending: boolean }) {
  const unread = !notification.readAt;
  return (
    <li className={`px-5 py-4 ${unread ? 'bg-accent-soft/30' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-text">{notification.title}</p>
            {unread && <span className="h-2 w-2 rounded-full bg-accent" />}
          </div>
          <p className="mt-1 text-sm text-text-secondary">{notification.message}</p>
          <p className="mt-2 text-xs text-text-secondary">{new Date(notification.createdAt).toLocaleString()}</p>
        </div>
        {unread && <Button variant="ghost" className="shrink-0 !px-2 !py-1 text-xs" disabled={pending} onClick={onRead}>Mark read</Button>}
      </div>
    </li>
  );
}
