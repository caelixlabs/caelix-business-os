'use client';

import { Activity } from 'lucide-react';

import { ActivityFeed } from '@/components/data/activity-feed';
import { formatDate } from '@/lib/format';

interface RecentActivityPanelProps {
  items: { id: string; action: string; entityType: string; createdAt: string }[];
}

function humanizeAction(action: string): string {
  const [, verb] = action.split('.');
  const word = (verb ?? action).replace(/_/g, ' ');
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function RecentActivityPanel({ items }: RecentActivityPanelProps) {
  return (
    <ActivityFeed
      items={items.map((log) => ({
        id: log.id,
        title: `${log.entityType} ${humanizeAction(log.action)}`,
        timestamp: formatDate(log.createdAt, 'relative'),
        icon: <Activity className="h-4 w-4" />,
      }))}
    />
  );
}
