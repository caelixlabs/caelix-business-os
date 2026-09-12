import { AlertCircle, CreditCard, RotateCcw } from 'lucide-react';

import { StatCard } from '@/components/data/stat-card';
import { PATHS } from '@/routes/paths';

export function SubscriptionSection() {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-text">Subscriptions</h2>
        <p className="mt-0.5 text-xs text-text-secondary">
          Current subscription health and renewals.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          href={PATHS.music.subscriptions}
          title="Active"
          value="—"
          description="active subscriptions"
          icon={CreditCard}
        />
        <StatCard
          href={`${PATHS.music.subscriptions}?filter=renewals`}
          title="Upcoming renewals"
          value="—"
          description="next 7 days"
          icon={RotateCcw}
        />
        <StatCard
          href={`${PATHS.music.subscriptions}?status=EXPIRED`}
          title="Expired"
          value="—"
          description="need attention"
          icon={AlertCircle}
        />
      </div>
    </section>
  );
}
