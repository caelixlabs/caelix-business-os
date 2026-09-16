'use client';

import { ChartPanel } from '@/components/data/chart-panel';
import type { MusicDashboardOverview } from '@/features/music/dashboard/types';

const STAGES = [
  { key: 'NEW', label: 'New' },
  { key: 'CONTACTED', label: 'Contacted' },
  { key: 'QUALIFIED', label: 'Trial booked' },
  { key: 'CONVERTED', label: 'Enrolled' },
];

export function LeadsPipelinePanel({ data }: { data: MusicDashboardOverview }) {
  const max = Math.max(1, data.leads.total);

  return (
    <ChartPanel title="Leads pipeline" description="last 7 days">
      <div className="flex flex-col gap-3">
        {STAGES.map((stage) => {
          const count = data.leads.byStatus[stage.key] ?? 0;
          return (
            <div key={stage.key}>
              <div className="mb-1 flex items-baseline justify-between text-xs">
                <span className="text-text-secondary">{stage.label}</span>
                <span className="font-semibold text-text">{count}</span>
              </div>
              <div className="h-1.5 rounded-full bg-canvas">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${Math.round((count / max) * 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </ChartPanel>
  );
}
