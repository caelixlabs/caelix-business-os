'use client';

import { ChevronRight, Menu, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { INDUSTRY_REGISTRY } from '@/core/industry/industry.registry';
import type { IndustryType } from '@/core/industry/industry.types';
import { BREADCRUMB_ROOT_HREF, useBreadcrumb } from '@/core/navigation/hooks/use-breadcrumb';
import { NotificationBell } from '@/features/notifications/components/notification-bell';
import { OrganizationSwitcher } from '@/components/layout/organization-switcher';
import { AccountMenu } from '@/components/layout/account-menu';
import { useUIStore } from '@/store/ui.store';

// Pages reachable outside the sidebar's own nav tree (e.g. from the
// account menu) — useBreadcrumb can't resolve these from the registry,
// so they get a one-off fallback label instead of a hand-maintained
// map for every route.
const UNLISTED_PAGE_LABELS: Record<string, string> = {
  '/dashboard/profile': 'My profile',
};

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const { organization } = useOrganizationContext();
  const breadcrumb = useBreadcrumb();
  const setCommandPaletteOpen = useUIStore(
    (state) => state.setCommandPaletteOpen,
  );

  const definition = organization
    ? INDUSTRY_REGISTRY[organization.industry as IndustryType]
    : undefined;

  const pageLabel = breadcrumb?.itemLabel ?? UNLISTED_PAGE_LABELS[pathname ?? ''] ?? 'Workspace';

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

        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5">
          <Link
            href={BREADCRUMB_ROOT_HREF}
            className="hidden min-w-0 shrink truncate text-xs font-medium text-text-secondary hover:text-text sm:block"
          >
            {definition?.label ?? 'Workspace'}
          </Link>

          {breadcrumb?.groupLabel && (
            <>
              <ChevronRight className="hidden h-3 w-3 shrink-0 text-text-secondary/60 md:block" />
              {breadcrumb.groupHref ? (
                <Link
                  href={breadcrumb.groupHref}
                  className="hidden min-w-0 shrink truncate text-xs font-medium text-text-secondary hover:text-text md:block"
                >
                  {breadcrumb.groupLabel}
                </Link>
              ) : (
                <span className="hidden min-w-0 shrink truncate text-xs font-medium text-text-secondary md:block">
                  {breadcrumb.groupLabel}
                </span>
              )}
            </>
          )}

          <ChevronRight className="hidden h-3 w-3 shrink-0 text-text-secondary/60 sm:block" />

          <span aria-current="page" className="shrink-0 truncate text-xs font-semibold text-text sm:text-sm">
            {pageLabel}
          </span>
        </nav>
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
