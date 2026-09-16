'use client';

import { ChartPanel } from '@/components/data/chart-panel';

interface LiveSession {
  id: string;
  name: string;
  personName: string | null;
  minutesLeft: number;
}

interface LiveSessionsPanelProps {
  title: string;
  sessions: LiveSession[];
}

export function LiveSessionsPanel({ title, sessions }: LiveSessionsPanelProps) {
  return (
    <ChartPanel title={title} empty={sessions.length === 0}>
      <ul className="flex flex-col divide-y divide-border/70">
        {sessions.map((session) => (
          <li key={session.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
              <span className="truncate text-sm text-text">{session.personName ?? 'Unassigned'}</span>
            </div>
            <span className="shrink-0 text-xs text-text-secondary">
              {session.name} · {session.minutesLeft}m left
            </span>
          </li>
        ))}
      </ul>
    </ChartPanel>
  );
}
