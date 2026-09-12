'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, LogOut, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { useAuthStore } from '@/store/auth.store';
import { useLogout } from '@/features/auth/api/use-auth';
import { useNavigationItems } from '@/core/navigation/hooks/use-navigation-items';
import { useUIStore } from '@/store/ui.store';

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

function initials(firstName?: string, lastName?: string) {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
}

function SidebarContent({
  collapsed,
  mobile = false,
  onClose,
}: {
  collapsed: boolean;
  mobile?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const navigationGroups = useNavigationItems();
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <div className="flex h-full flex-col bg-ink text-white">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-3">
        <div className={`flex items-center gap-3 ${collapsed ? 'mx-auto' : ''}`}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
            <Image
              src="/brand/logo-mark.png"
              alt="Caelix"
              width={24}
              height={24}
              className="rounded-md"
            />
          </div>

          {!collapsed && (
            <div>
              <p className="text-sm font-semibold tracking-tight">Caelix</p>
              <p className="text-[11px] text-muted-on-ink">Business OS</p>
            </div>
          )}
        </div>

        {mobile && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted-on-ink hover:bg-white/10 hover:text-white"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2.5 py-5">
        {navigationGroups.map((group) => (
          <div key={group.key} className="mb-5 last:mb-0">
            {!collapsed && group.label && (
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-on-ink/60">
                {group.label}
              </p>
            )}

            <div className="space-y-1">
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname?.startsWith(item.href));

                const Icon = item.icon;

                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={onClose}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                      collapsed ? 'justify-center px-2' : ''
                    } ${
                      active
                        ? 'bg-accent text-white shadow-sm'
                        : 'text-muted-on-ink hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    <Icon className="h-[17px] w-[17px] shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 p-2.5">
        {user && (
          <div
            className={`mb-1 flex items-center gap-3 rounded-xl px-2.5 py-2.5 ${
              collapsed ? 'justify-center' : ''
            }`}
            title={collapsed ? `${user.firstName} ${user.lastName}` : undefined}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
              {initials(user.firstName, user.lastName)}
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {user.firstName} {user.lastName}
                </p>
                <p className="truncate text-[11px] text-muted-on-ink">
                  {user.role?.name ?? 'Member'}
                </p>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          title={collapsed ? 'Sign out' : undefined}
          className={`flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm text-muted-on-ink hover:bg-white/[0.06] hover:text-white disabled:opacity-50 ${
            collapsed ? 'justify-center px-2' : ''
          }`}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && 'Sign out'}
        </button>

        {!mobile && (
          <button
            type="button"
            onClick={toggleSidebar}
            className="mt-1 hidden h-9 w-full items-center justify-center rounded-xl text-muted-on-ink hover:bg-white/[0.06] hover:text-white lg:flex"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export function Sidebar({ open = false, onClose }: SidebarProps) {
  const collapsed = useUIStore((state) => state.sidebarCollapsed);

  return (
    <>
      <aside
        className={`hidden h-full shrink-0 transition-[width] duration-200 lg:block ${
          collapsed ? 'w-[68px]' : 'w-[240px]'
        }`}
      >
        <SidebarContent collapsed={collapsed} />
      </aside>

      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] shadow-2xl transition-transform duration-200 lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent collapsed={false} mobile onClose={onClose} />
      </aside>
    </>
  );
}
