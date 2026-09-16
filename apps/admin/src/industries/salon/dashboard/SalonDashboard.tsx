'use client';

import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';

export function SalonDashboard() {
  return (
    <div className="space-y-8">
      <PageHeader title="Salon workspace" description="Run appointments, checkout, and your stylist roster from one workspace." />
      <Card className="p-6">
        <h2 className="text-sm font-semibold text-text">Salon dashboard foundation</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Clients, appointments, and checkout are already live under Workspace — a full salon-specific overview
          will be composed here next.
        </p>
      </Card>
    </div>
  );
}
