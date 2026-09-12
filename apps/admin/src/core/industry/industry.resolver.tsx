'use client';

import { lazy, Suspense, type ComponentType } from 'react';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { INDUSTRY_REGISTRY, type IndustryType } from './industry.registry';
import {
  IndustryUnconfiguredState,
  OrganizationUnavailableState,
} from './components/industry-state';
import { IndustryDashboardSkeleton } from './components/industry-dashboard-skeleton';

// Computed once at module load (not during render) so every industry gets a
// single stable lazy component identity — recreating it per-render/per-memo
// would remount the dashboard's internal state on unrelated re-renders.
const DASHBOARD_COMPONENTS = Object.fromEntries(
  Object.entries(INDUSTRY_REGISTRY).map(([key, definition]) => [
    key,
    lazy(definition.dashboard),
  ]),
) as unknown as Record<IndustryType, ComponentType>;

export function IndustryDashboardResolver() {
  const { organization, isLoading, isError } = useOrganizationContext();

  const definition = organization
    ? INDUSTRY_REGISTRY[organization.industry]
    : undefined;

  if (isLoading) {
    return <IndustryDashboardSkeleton />;
  }

  if (isError || !organization) {
    return <OrganizationUnavailableState />;
  }

  if (!definition) {
    return <IndustryUnconfiguredState />;
  }

  const Dashboard = DASHBOARD_COMPONENTS[organization.industry];

  return (
    <Suspense fallback={<IndustryDashboardSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}
