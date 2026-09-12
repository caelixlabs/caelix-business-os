import { Card } from '@/components/ui/card';
import type { AuditLogEntry } from '@/features/audit/types';

const ACTION_LABELS: Record<string, string> = {
  'organization.created': 'Organization created',
  'branch.created': 'Branch created',
  'user.registered': 'User registered',
};

export function AuditLogList({ items }: { items: AuditLogEntry[] }) {
  return (
    <Card>
      <ul className="divide-y divide-border">
        {items.map((entry) => (
          <li key={entry.id} className="flex items-start justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-text">{ACTION_LABELS[entry.action] ?? entry.action}</p>
              <p className="mt-0.5 font-mono text-xs text-text-secondary">{entry.entityType}/{entry.entityId}</p>
            </div>
            <time className="shrink-0 text-xs text-text-secondary">{new Date(entry.createdAt).toLocaleString()}</time>
          </li>
        ))}
      </ul>
    </Card>
  );
}
