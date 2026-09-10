'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Music2,
  GitBranch,
  Users,
  ScrollText,
  Settings,
  LogOut,
  ShieldCheck,
  Bell,
} from 'lucide-react';

import { useAuthStore } from '@/store/auth.store';
import { useLogout } from '@/features/auth/api/use-auth';
import type { Organization } from '@/features/organizations/types';
import { usePermission } from '@/hooks/use-permission';

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  permission?: string;
  industry?: 'MUSIC_ORG' | 'GYM';
};

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, permission: undefined },
  { href: '/dashboard/music', label: 'Music Org', icon: Music2, permission: 'music:student-read', industry: 'MUSIC_ORG'},
  { href: '/dashboard/branches', label: 'Branches', icon: GitBranch, permission: 'branch:read' },
  { href: '/dashboard/users', label: 'Users', icon: Users, permission: 'user:read' },
  { href: '/dashboard/roles', label: 'Roles & permissions', icon: ShieldCheck, permission: 'user:role-assign' },
  { href: '/dashboard/audit-log', label: 'Audit log', icon: ScrollText, permission: 'organization:read' },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell, permission: undefined },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings, permission: 'organization:read' },
];

export function Sidebar({ organization }: { organization: Organization | null }) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const { has } = usePermission();
  // const { data: workspace } = useWorkspace(user?.organizationId);

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-ink text-white">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <Image
          src="/brand/logo-mark.png"
          alt="Caelix"
          width={28}
          height={28}
          className="rounded-md"
        />
        <span className="text-sm font-semibold tracking-wide">Caelix</span>
      </div>

      {organization && (
        <div className="mx-4 mb-4 rounded-md bg-ink-2 px-3 py-2.5">
          <p className="text-[11px] uppercase tracking-wide text-muted-on-ink">Organization</p>
          <p className="mt-0.5 truncate text-sm text-white">{organization.name}</p>
          <p className="truncate font-mono text-[11px] text-muted-on-ink">{organization.slug}</p>
        </div>
      )}

      <nav className="flex-1 space-y-0.5 px-3">
        {NAV_ITEMS.map((item) => {
          if (item.industry && organization?.industry !== item.industry) return null;
          if (item.permission && !has(item.permission)) return null;
          const active =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors duration-150
                ${active ? 'bg-accent text-white' : 'text-muted-on-ink hover:bg-ink-2 hover:text-white'}`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-ink-border p-3">
        {user && (
          <div className="mb-2 truncate px-2 text-xs text-muted-on-ink">
            {user.firstName} {user.lastName}
          </div>
        )}
        <button
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-muted-on-ink transition-colors duration-150 hover:bg-ink-2 hover:text-white cursor-pointer disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
