'use client';

import { Menu, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { INDUSTRY_REGISTRY } from '@/core/industry/industry.registry';
import type { IndustryType } from '@/core/industry/industry.types';
import { NotificationBell } from '@/features/notifications/components/notification-bell';
import { OrganizationSwitcher } from '@/components/layout/organization-switcher';
import { AccountMenu } from '@/components/layout/account-menu';
import { useUIStore } from '@/store/ui.store';

const PAGE_LABELS: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/music': 'Music',
  '/dashboard/music/calendar': 'Calendar',
  '/dashboard/music/students': 'Students',
  '/dashboard/music/teachers': 'Teachers',
  '/dashboard/music/courses': 'Courses',
  '/dashboard/music/batches': 'Batches',
  '/dashboard/music/subscriptions': 'Subscriptions',
  '/dashboard/gym': 'Gym',
  '/dashboard/branches': 'Branches',
  '/dashboard/users': 'People',
  '/dashboard/roles': 'Roles & access',
  '/dashboard/audit-log': 'Audit log',
  '/dashboard/notifications': 'Notifications',
  '/dashboard/settings': 'Settings',
  '/dashboard/profile': 'My profile',
  '/dashboard/enquiries': 'Enquiries',
};

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const { organization } = useOrganizationContext();
  const setCommandPaletteOpen = useUIStore(
    (state) => state.setCommandPaletteOpen,
  );

  const definition = organization
    ? INDUSTRY_REGISTRY[organization.industry as IndustryType]
    : undefined;

  const pageLabel = PAGE_LABELS[pathname ?? ''] ?? 'Workspace';

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/80 bg-surface/95 px-3 backdrop-blur sm:px-5 lg:px-7">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-text-secondary hover:bg-canvas hover:text-text lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <OrganizationSwitcher />

        <span className="hidden h-4 w-px bg-border sm:block" />

        <span className="hidden truncate text-xs font-medium text-text-secondary sm:block">
          {definition?.label ?? 'Workspace'}
        </span>

        <span className="hidden text-text-secondary sm:block">/</span>

        <span className="truncate text-xs font-medium text-text sm:text-sm">
          {pageLabel}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden h-9 items-center gap-2 rounded-lg border border-border bg-canvas px-3 text-xs text-text-secondary transition-colors hover:border-text-secondary/30 hover:text-text sm:flex"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search</span>
          <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px]">
            ⌘K
          </kbd>
        </button>

        <NotificationBell />
        <AccountMenu />
      </div>
    </header>
  );
}
