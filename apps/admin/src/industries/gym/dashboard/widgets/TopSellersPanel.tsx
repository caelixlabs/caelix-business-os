'use client';

import { ChartPanel } from '@/components/data/chart-panel';
import { formatCurrency } from '@/lib/format';
import type { GymDashboardOverview } from '@/features/gym/dashboard/types';

export function TopSellersPanel({ data }: { data: GymDashboardOverview }) {
  const max = Math.max(1, ...data.topSellers.map((row) => row.totalSales));

  return (
    <ChartPanel title="Top sellers" description="POS sales, this month" empty={data.topSellers.length === 0}>
      <div className="flex flex-col gap-3">
        {data.topSellers.map((row) => (
          <div key={row.userId}>
            <div className="mb-1 flex items-baseline justify-between text-xs">
              <span className="text-text-secondary">{row.name}</span>
              <span className="font-semibold text-text">{formatCurrency(row.totalSales)}</span>
            </div>
            <div className="h-1.5 rounded-full bg-canvas">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${Math.round((row.totalSales / max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </ChartPanel>
  );
}
