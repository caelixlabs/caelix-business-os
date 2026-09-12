'use client';

import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/features/notifications/api/use-notifications';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { NotificationList } from './NotificationList';

export default function NotificationsSection() {
  const { data, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  if (isLoading || !data) {
    return <><PageHeader title="Notifications" description="Recent activity that needs your attention." /><div className="flex justify-center py-16"><Spinner /></div></>;
  }

  return (
    <div>
      <PageHeader title="Notifications" description="Recent activity that needs your attention." action={
        <Button variant="secondary" disabled={data.unreadCount === 0 || markAllRead.isPending} loading={markAllRead.isPending} onClick={() => markAllRead.mutate()}>Mark all read</Button>
      } />
      {data.items.length === 0 ? <EmptyState title="No notifications" description="You're all caught up." /> : <NotificationList notifications={data.items} onRead={(id) => markRead.mutate(id)} pending={markRead.isPending} />}
    </div>
  );
}
