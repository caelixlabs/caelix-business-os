'use client';

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

import { ChartPanel } from '@/components/data/chart-panel';

interface AttendanceTrendPanelProps {
  trend: { date: string; count: number }[];
  title?: string;
}

export function AttendanceTrendPanel({ trend, title = 'Attendance' }: AttendanceTrendPanelProps) {
  const rows = trend.map((row) => ({
    label: new Date(row.date).toLocaleDateString('en-IN', { weekday: 'short' }),
    count: row.count,
  }));

  return (
    <ChartPanel title={title} description="last 7 days">
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={rows}>
          <XAxis dataKey="label" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: 'var(--accent-soft)' }}
            contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
          />
          <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}
