'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ContactRound, CreditCard, FileText, Wallet } from 'lucide-react';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useReportsOverview } from '@/features/reports/api/use-reports';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/data/stat-card';
import { ChartPanel } from '@/components/data/chart-panel';
import { formatCurrency } from '@/lib/format';

function statusBreakdownToRows(byStatus: Record<string, number>) {
  return Object.entries(byStatus).map(([status, count]) => ({
    status: status.replace('_', ' ').toLowerCase(),
    count,
  }));
}

function StatusBarChart({ rows }: { rows: { status: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={rows}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="status" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: 'var(--accent-soft)' }}
          contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
        />
        <Bar dataKey="count" fill="var(--accent)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ReportsSection() {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;
  const { data, isLoading } = useReportsOverview(organizationId);

  const enquiryRows = data ? statusBreakdownToRows(data.enquiries.byStatus) : [];
  const bookingRows = data ? statusBreakdownToRows(data.bookings.byStatus) : [];

  return (
    <div>
      <PageHeader title="Reports" description="Cross-domain activity and revenue at a glance." />

      <div className="mb-6 grid gap-3 sm:grid-cols-4">
        <StatCard
          title="Revenue collected"
          value={isLoading ? '—' : formatCurrency(data?.payments.totalAmount ?? 0)}
          description="all-time payments"
          icon={Wallet}
        />
        <StatCard
          title="Outstanding"
          value={isLoading ? '—' : formatCurrency(data?.invoices.outstandingAmount ?? 0)}
          description={`across ${data?.invoices.total ?? 0} invoices`}
          icon={CreditCard}
        />
        <StatCard
          title="Contacts"
          value={isLoading ? '—' : data?.contacts.total ?? 0}
          description="total on file"
          icon={ContactRound}
        />
        <StatCard
          title="Documents"
          value={isLoading ? '—' : data?.documents.total ?? 0}
          description="uploaded"
          icon={FileText}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartPanel
          title="Enquiries by status"
          description={`${data?.enquiries.total ?? 0} total`}
          loading={isLoading}
          empty={!isLoading && enquiryRows.length === 0}
        >
          <StatusBarChart rows={enquiryRows} />
        </ChartPanel>

        <ChartPanel
          title="Bookings by status"
          description={`${data?.bookings.total ?? 0} total`}
          loading={isLoading}
          empty={!isLoading && bookingRows.length === 0}
        >
          <StatusBarChart rows={bookingRows} />
        </ChartPanel>
      </div>
    </div>
  );
}
