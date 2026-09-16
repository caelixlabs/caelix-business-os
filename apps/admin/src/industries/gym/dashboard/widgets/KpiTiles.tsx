'use client';

import { CalendarClock, CreditCard, UserCheck, Users, Users2 } from 'lucide-react';

import { StatCard } from '@/components/data/stat-card';
import { formatCurrency } from '@/lib/format';
import type { GymDashboardOverview } from '@/features/gym/dashboard/types';
import type { DashboardWidgetPrefs } from '@/features/dashboard-widgets/types';

export function KpiTiles({ data, widgets }: { data: GymDashboardOverview; widgets: DashboardWidgetPrefs }) {
  const tiles = [
    widgets.revenue !== false && (
      <StatCard key="revenue" title="Revenue (MTD)" value={formatCurrency(data.revenueMtd)} icon={CreditCard} />
    ),
    widgets.activeMembers !== false && (
      <StatCard key="activeMembers" title="Active members" value={data.activeMembers} icon={Users} />
    ),
    widgets.presentToday !== false && (
      <StatCard
        key="presentToday"
        title="Present today"
        value={`${data.presentToday.present}/${data.presentToday.total || data.presentToday.present}`}
        description="checked in today"
        icon={UserCheck}
      />
    ),
    widgets.classesInSession !== false && (
      <StatCard
        key="classesInSession"
        title="Classes in session"
        value={data.classesInSession.length}
        description="live right now"
        icon={CalendarClock}
      />
    ),
    widgets.totalTrainers !== false && (
      <StatCard key="totalTrainers" title="Total trainers" value={data.totalTrainers} icon={Users2} />
    ),
  ].filter(Boolean);

  if (tiles.length === 0) return null;

  return <div className="mb-6 grid gap-3 sm:grid-cols-3">{tiles}</div>;
}
