'use client';

import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';

export function GymDashboard() {
  return (
    <div className="space-y-8">
      <PageHeader title="Gym workspace" description="Run your gym operations from one focused workspace." />
      <Card className="p-6">
        <h2 className="text-sm font-semibold text-text">Gym dashboard foundation</h2>
        <p className="mt-1 text-sm text-text-secondary">Industry-specific sections will be composed here as the Gym capability set is implemented.</p>
      </Card>
    </div>
  );
}
