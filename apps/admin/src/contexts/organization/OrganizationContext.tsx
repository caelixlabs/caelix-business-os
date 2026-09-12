'use client';

import { createContext, useContext, type ReactNode } from 'react';

import { useAuthStore } from '@/store/auth.store';
import { useOrganization } from '@/features/organizations/api/use-organizations';
import type { Organization } from '@/features/organizations/types';
import { INDUSTRY_REGISTRY } from '@/core/industry/industry.registry';

interface OrganizationContextValue {
  organization: Organization | null;
  organizationId: string | null;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  isConfigured: boolean;
}

const OrganizationContext = createContext<OrganizationContextValue | null>(null);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const organizationId = useAuthStore(
    (state) => state.user?.organizationId ?? null,
  );

  const query = useOrganization(organizationId ?? undefined);
  const organization = query.data ?? null;

  const isConfigured = Boolean(
    organization?.industry && INDUSTRY_REGISTRY[organization.industry],
  );

  return (
    <OrganizationContext.Provider
      value={{
        organization,
        organizationId,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        isConfigured,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganizationContext() {
  const context = useContext(OrganizationContext);

  if (!context) {
    throw new Error(
      'useOrganizationContext must be used inside OrganizationProvider',
    );
  }

  return context;
}
