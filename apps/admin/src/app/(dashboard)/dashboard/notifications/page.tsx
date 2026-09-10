"use client";

import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/features/notifications/api/use-notifications";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  
  const { data, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  if (isLoading || !data) {
    return (
      <div>
        <PageHeader
          title="Notifications"
          description="Recent activity that needs your attention."
        />

        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      </div>
    );
  }

  const notifications = data.items;

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Recent activity that needs your attention."
        action={
          <Button
            variant="secondary"
            disabled={data.unreadCount === 0 || markAllRead.isPending}
            loading={markAllRead.isPending}
            onClick={() => markAllRead.mutate()}
          >
            Mark all read
          </Button>
        }
      />

      {notifications.length === 0 ? (
        <EmptyState
          title="No notifications"
          description="You're all caught up."
        />
      ) : (
        <Card>
          <ul className="divide-y divide-border">
            {notifications.map((notification) => {
              const unread = !notification.readAt;

              return (
                <li
                  key={notification.id}
                  className={`px-5 py-4 ${unread ? "bg-accent-soft/30" : ""}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-text">
                          {notification.title}
                        </p>

                        {unread && (
                          <span className="h-2 w-2 rounded-full bg-accent" />
                        )}
                      </div>

                      <p className="mt-1 text-sm text-text-secondary">
                        {notification.message}
                      </p>

                      <p className="mt-2 text-xs text-text-secondary">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {unread && (
                      <Button
                        variant="ghost"
                        className="shrink-0 !px-2 !py-1 text-xs"
                        disabled={markRead.isPending}
                        onClick={() => markRead.mutate(notification.id)}
                      >
                        Mark read
                      </Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}
