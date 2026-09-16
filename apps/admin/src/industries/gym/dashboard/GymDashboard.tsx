'use client';

import Link from 'next/link';
import { Settings2, ShoppingCart } from 'lucide-react';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useAuthStore } from '@/store/auth.store';
import { useGymDashboardOverview } from '@/features/gym/dashboard/api/use-gym-dashboard';
import { useDashboardWidgets } from '@/features/dashboard-widgets/api/use-dashboard-widgets';
import { PageHeader } from '@/components/ui/page-header';
import { Spinner } from '@/components/ui/spinner';
import { LiveSessionsPanel } from '@/components/dashboard/LiveSessionsPanel';
import { AttendanceTrendPanel } from '@/components/dashboard/AttendanceTrendPanel';
import { MembershipDuePanel } from '@/components/dashboard/MembershipDuePanel';
import { RecentActivityPanel } from '@/components/dashboard/RecentActivityPanel';
import { PATHS } from '@/routes/paths';

import { KpiTiles } from './widgets/KpiTiles';
import { TopSellersPanel } from './widgets/TopSellersPanel';

export function GymDashboard() {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;
  const user = useAuthStore((state) => state.user);

  const { data, isLoading } = useGymDashboardOverview(organizationId);
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
              href={PATHS.settings}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text transition hover:border-text-secondary/30"
            >
              <Settings2 className="h-4 w-4" />
              Customize dashboard
            </Link>
            <Link
              href={PATHS.pos}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-white shadow-sm transition hover:bg-accent-ink"
            >
              <ShoppingCart className="h-4 w-4" />
              Point of sale
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
            {widgets.classesLiveNow !== false && (
              <LiveSessionsPanel
                title="Classes live now"
                sessions={data.classesInSession.map((gymClass) => ({
                  id: gymClass.id,
                  name: gymClass.name,
                  personName: gymClass.trainerName,
                  minutesLeft: gymClass.minutesLeft,
                }))}
              />
            )}
            {widgets.attendanceTrend !== false && <AttendanceTrendPanel trend={data.attendanceTrend} />}
            {widgets.topSellers !== false && <TopSellersPanel data={data} />}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {widgets.membershipsDue !== false && (
              <MembershipDuePanel title="Memberships due" personLabel="Member" items={data.membershipsDue} />
            )}
            {widgets.recentActivity !== false && <RecentActivityPanel items={data.recentActivity} />}
          </div>
        </>
      )}
    </div>
  );
}
