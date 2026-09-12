import type { ReactNode } from 'react';

import { Card } from '@/components/ui/card';

export interface ActivityFeedItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  icon?: ReactNode;
}

export function ActivityFeed({
  items,
  emptyMessage = 'No recent activity.',
}: {
  items: ActivityFeedItem[];
  emptyMessage?: string;
}) {
  return (
    <Card className="overflow-hidden">
      {items.length === 0 ? (
        <div className="p-6 text-sm text-text-secondary">
          {emptyMessage}
        </div>
      ) : (
        <ol className="divide-y divide-border/70">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3 px-5 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-ink">
                {item.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text">{item.title}</p>
                {item.description && (
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {item.description}
                  </p>
                )}
                <p className="mt-1 text-[11px] text-text-secondary">
                  {item.timestamp}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
