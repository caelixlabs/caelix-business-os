'use client';

import { AlertCircle, CreditCard, PauseCircle } from 'lucide-react';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useMusicEnrollments } from '@/features/music/enrollments/api/use-enrollments';
import { StatCard } from '@/components/data/stat-card';
import { PATHS } from '@/routes/paths';

export function SubscriptionSection() {
  const { organization } = useOrganizationContext();
  const { data: enrollments } = useMusicEnrollments(organization?.id);

  const active = enrollments?.filter((e) => e.status === 'ACTIVE').length ?? 0;
  const paused = enrollments?.filter((e) => e.status === 'PAUSED').length ?? 0;
  const cancelled = enrollments?.filter((e) => e.status === 'CANCELLED').length ?? 0;

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-text">Subscriptions</h2>
        <p className="mt-0.5 text-xs text-text-secondary">
          Current subscription health across all batches.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          href={PATHS.music.subscriptions}
          title="Active"
          value={enrollments ? active : '—'}
          description="active subscriptions"
          icon={CreditCard}
        />
        <StatCard
          href={PATHS.music.subscriptions}
          title="Paused"
          value={enrollments ? paused : '—'}
          description="need follow-up"
          icon={PauseCircle}
        />
        <StatCard
          href={PATHS.music.subscriptions}
          title="Cancelled"
          value={enrollments ? cancelled : '—'}
          description="all time"
          icon={AlertCircle}
        />
      </div>
    </section>
  );
}
