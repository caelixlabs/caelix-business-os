'use client';

import { CalendarClock, ContactRound, CreditCard, GraduationCap, UserCheck, Users2 } from 'lucide-react';

import { StatCard } from '@/components/data/stat-card';
import { formatCurrency } from '@/lib/format';
import type { MusicDashboardOverview } from '@/features/music/dashboard/types';
import type { DashboardWidgetPrefs } from '@/features/dashboard-widgets/types';

export function KpiTiles({ data, widgets }: { data: MusicDashboardOverview; widgets: DashboardWidgetPrefs }) {
  const tiles = [
    widgets.revenue !== false && (
      <StatCard key="revenue" title="Revenue (MTD)" value={formatCurrency(data.revenueMtd)} icon={CreditCard} />
    ),
    widgets.activeStudents !== false && (
      <StatCard
        key="activeStudents"
        title="Active students"
        value={data.activeStudents}
        icon={GraduationCap}
      />
    ),
    widgets.presentToday !== false && (
      <StatCard
        key="presentToday"
        title="Present today"
        value={`${data.presentToday.present}/${data.presentToday.total || data.presentToday.present}`}
        description="marked present today"
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
    widgets.totalTeachers !== false && (
      <StatCard key="totalTeachers" title="Total teachers" value={data.totalTeachers} icon={Users2} />
    ),
    widgets.newLeads !== false && (
      <StatCard
        key="newLeads"
        title="New leads (7d)"
        value={data.leads.total}
        description={`${data.leads.converted} converted`}
        icon={ContactRound}
      />
    ),
  ].filter(Boolean);

  if (tiles.length === 0) return null;

  return <div className="mb-6 grid gap-3 sm:grid-cols-3">{tiles}</div>;
}
