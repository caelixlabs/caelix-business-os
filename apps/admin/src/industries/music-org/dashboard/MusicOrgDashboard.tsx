'use client';

import Link from 'next/link';
import { CalendarDays, Settings2 } from 'lucide-react';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useAuthStore } from '@/store/auth.store';
import { useMusicDashboardOverview } from '@/features/music/dashboard/api/use-music-dashboard';
import { useDashboardWidgets } from '@/features/dashboard-widgets/api/use-dashboard-widgets';
import { PageHeader } from '@/components/ui/page-header';
import { Spinner } from '@/components/ui/spinner';

import { KpiTiles } from './widgets/KpiTiles';
import { LeadsPipelinePanel } from './widgets/LeadsPipelinePanel';
import { LiveSessionsPanel } from '@/components/dashboard/LiveSessionsPanel';
import { AttendanceTrendPanel } from '@/components/dashboard/AttendanceTrendPanel';
import { MembershipDuePanel } from '@/components/dashboard/MembershipDuePanel';
import { RecentActivityPanel } from '@/components/dashboard/RecentActivityPanel';

export function MusicOrgDashboard() {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;
  const user = useAuthStore((state) => state.user);

  const { data, isLoading } = useMusicDashboardOverview(organizationId);
  const { data: widgets } = useDashboardWidgets(organizationId);

  const greetingName = user?.firstName ?? 'there';
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  const liveCount = data?.classesInSession.length ?? 0;

  return (
    <div>
      <PageHeader
        title={`Good morning, ${greetingName}`}
        description={`${today}${liveCount > 0 ? ` · ${liveCount} class${liveCount === 1 ? '' : 'es'} live right now` : ''}`}
        action={
          <div className="flex gap-2">
            <Link
              href="/dashboard/settings"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text transition hover:border-text-secondary/30"
            >
              <Settings2 className="h-4 w-4" />
              Customize dashboard
            </Link>
            <Link
              href="/dashboard/music/calendar"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-white shadow-sm transition hover:bg-accent-ink"
            >
              <CalendarDays className="h-4 w-4" />
              Open calendar
            </Link>
          </div>
        }
      />

      {isLoading || !data || !widgets ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <>
          <KpiTiles data={data} widgets={widgets} />

          <div className="mb-4 grid gap-4 lg:grid-cols-3">
            {widgets.leadsPipeline !== false && <LeadsPipelinePanel data={data} />}
            {widgets.teachersRightNow !== false && (
              <LiveSessionsPanel
                title="Classes live now"
                sessions={data.classesInSession.map((batch) => ({
                  id: batch.id,
                  name: batch.name,
                  personName: batch.teacherName,
                  minutesLeft: batch.minutesLeft,
                }))}
              />
            )}
            {widgets.attendanceTrend !== false && <AttendanceTrendPanel trend={data.attendanceTrend} />}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {widgets.renewalsDue !== false && (
              <MembershipDuePanel title="Renewals due" personLabel="Student" items={data.renewalsDue} />
            )}
            {widgets.recentActivity !== false && <RecentActivityPanel items={data.recentActivity} />}
          </div>
        </>
      )}
    </div>
  );
}
