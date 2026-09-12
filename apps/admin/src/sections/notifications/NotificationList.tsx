import { Card } from '@/components/ui/card';
import type { NotificationItem } from '@/features/notifications/types';
import { NotificationItem as NotificationItems} from './components/NotificationItem';

export function NotificationList({ notifications, onRead, pending }: { notifications: NotificationItem[]; onRead: (id: string) => void; pending: boolean }) {
  return (
    <Card>
      <ul className="divide-y divide-border">
        {notifications.map((notification) => (
          <NotificationItems key={notification.id} notification={notification} pending={pending} onRead={() => onRead(notification.id)} />
        ))}
      </ul>
    </Card>
  );
}
