import type { LucideIcon } from 'lucide-react';

import type { IndustryType } from '@/core/industry/industry.types';

export type NavigationBadge = 'count' | 'dot';

export interface NavigationItem {
  key: string;
  href: string;
  label: string;
  icon: LucideIcon;
  permission?: string;
  moduleKey?: string;
  industry?: IndustryType;
  badge?: NavigationBadge;
}

export interface NavigationGroup {
  key: string;
  label?: string;
  items: NavigationItem[];
}
