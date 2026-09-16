'use client';

import { usePathname } from 'next/navigation';
import { useNavigationItems } from './use-navigation-items';
import { PATHS } from '@/routes/paths';

export interface Breadcrumb {
  groupLabel?: string;
  groupHref?: string;
  itemLabel: string;
}

/**
 * Derives the breadcrumb straight from the resolved navigation tree
 * instead of a hand-maintained route→label map, so it can never go
 * stale when a new page is added to the sidebar. groupHref points at
 * the group's first item — groups have no page of their own, so that's
 * the most reasonable place for a click on the group segment to land.
 */
export function useBreadcrumb(): Breadcrumb | null {
  const pathname = usePathname();
  const groups = useNavigationItems();

  for (const group of groups) {
    for (const item of group.items) {
      const active =
        pathname === item.href ||
        (item.href !== '/dashboard' && pathname?.startsWith(item.href));

      if (active) {
        const isCurrentGroup = pathname === item.href && group.items[0]?.href === item.href;
        return {
          groupLabel: group.label,
          groupHref: isCurrentGroup ? undefined : group.items[0]?.href,
          itemLabel: item.label,
        };
      }
    }
  }

  return null;
}

export const BREADCRUMB_ROOT_HREF = PATHS.dashboard;
