'use client';

import Link from 'next/link';
import { LogOut, Moon, Settings, Sun, UserCircle } from 'lucide-react';

import { useAuthStore } from '@/store/auth.store';
import { useLogout } from '@/features/auth/api/use-auth';
import { useUIStore } from '@/store/ui.store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar } from '@/components/ui/avatar';

export function AccountMenu() {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const darkMode = useUIStore((state) => state.darkMode);
  const toggleDarkMode = useUIStore((state) => state.toggleDarkMode);

  if (!user) return null;

  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Open account menu"
          className="rounded-full focus-visible:outline-none"
        >
          <Avatar initials={initials} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3 py-1">
            <Avatar initials={initials} />
            <div className="min-w-0">
              <p className="truncate font-medium text-text">
                {user.firstName} {user.lastName}
              </p>
              <p className="truncate text-[11px] text-text-secondary">
                {user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <UserCircle className="mr-2 h-4 w-4" />
          <Link href="/dashboard/profile" className="flex-1">
            My profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <Link href="/dashboard/settings" className="flex-1">
            Preferences
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem onSelect={toggleDarkMode}>
          {darkMode ? (
            <Sun className="mr-2 h-4 w-4" />
          ) : (
            <Moon className="mr-2 h-4 w-4" />
          )}
          {darkMode ? 'Light mode' : 'Dark mode'}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          destructive
          onSelect={() => logout.mutate()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
