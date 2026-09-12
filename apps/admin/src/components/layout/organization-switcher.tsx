'use client';

import Link from 'next/link';
import { Building2, ChevronDown, Settings2 } from 'lucide-react';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { INDUSTRY_REGISTRY } from '@/core/industry/industry.registry';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function OrganizationSwitcher() {
  const { organization } = useOrganizationContext();
  const definition = organization
    ? INDUSTRY_REGISTRY[organization.industry]
    : undefined;

  if (!organization) {
    return (
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-text">Workspace</p>
        <p className="text-xs text-text-secondary">Loading organization...</p>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group flex min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-canvas"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-ink">
            <Building2 className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="max-w-48 truncate text-sm font-semibold text-text">
                {organization.name}
              </span>
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-text-secondary transition-transform group-data-[state=open]:rotate-180" />
            </div>

            <span className="block truncate text-[11px] text-text-secondary">
              {definition?.label ?? 'Industry not configured'}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-secondary">
            Current workspace
          </p>
          <p className="mt-1 truncate text-sm font-medium text-text">
            {organization.name}
          </p>
          <p className="truncate text-[11px] text-text-secondary">
            {organization.slug}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Settings2 className="mr-2 h-4 w-4" />
          <Link href="/dashboard/settings" className="flex-1">
            Organization settings
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
