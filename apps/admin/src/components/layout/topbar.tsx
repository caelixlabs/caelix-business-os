'use client';

import { NotificationBell } from '@/features/notifications/components/notification-bell';

export function Topbar() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-end border-b border-border bg-surface px-6">
      <NotificationBell />
    </header>
  );
}
