'use client';

import { ChartPanel } from '@/components/data/chart-panel';
import { formatCurrency, formatDate } from '@/lib/format';

interface MembershipDueRow {
  id: string;
  contactName: string;
  planName: string;
  expiresAt: string;
  amount: number;
}

interface MembershipDuePanelProps {
  items: MembershipDueRow[];
  title?: string;
  personLabel?: string;
}

export function MembershipDuePanel({ items, title = 'Renewals due', personLabel = 'Member' }: MembershipDuePanelProps) {
  return (
    <ChartPanel title={title} description="next 7 days" empty={items.length === 0}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-wide text-text-secondary">
              <th className="pb-2 font-medium">{personLabel}</th>
              <th className="pb-2 font-medium">Plan</th>
              <th className="pb-2 font-medium">Due</th>
              <th className="pb-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {items.map((row) => (
              <tr key={row.id}>
                <td className="py-2 text-text">{row.contactName || '—'}</td>
                <td className="py-2 text-text-secondary">{row.planName}</td>
                <td className="py-2 text-text-secondary">{formatDate(row.expiresAt)}</td>
                <td className="py-2 text-right font-medium text-text">{formatCurrency(row.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartPanel>
  );
}
