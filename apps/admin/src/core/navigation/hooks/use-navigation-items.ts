'use client';

import { useMemo } from 'react';

import { usePermission } from '@/core/access/hooks/use-permission';
import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { INDUSTRY_REGISTRY } from '@/core/industry/industry.registry';
import { resolveNavigationGroups } from '../navigation.resolver';

export function useNavigationItems() {
  const { organization } = useOrganizationContext();
  const { has } = usePermission();

  return useMemo(() => {
    const groups = organization
      ? INDUSTRY_REGISTRY[organization.industry]?.navigationGroups ?? []
      : [];

    return resolveNavigationGroups(groups, organization?.industry, has);
  }, [organization, has]);
}
