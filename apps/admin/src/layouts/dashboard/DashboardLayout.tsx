'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/store/auth.store';
import { OrganizationProvider } from '@/contexts/organization/OrganizationContext';
import { IndustryThemeProvider } from '@/contexts/theme/IndustryThemeProvider';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { CommandPalette } from '@/components/layout/command-palette';
import { Spinner } from '@/components/ui/spinner';

export function DashboardLayout({ children }: { children: ReactNode }) {
  const status = useAuthStore((state) => state.status);
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex h-dvh items-center justify-center bg-canvas">
        <Spinner />
      </div>
    );
  }

  return (
    <OrganizationProvider>
      <IndustryThemeProvider>
        <div className="flex h-dvh overflow-hidden bg-canvas">
          <Sidebar
            open={mobileNavOpen}
            onClose={() => setMobileNavOpen(false)}
          />

          <section className="flex min-w-0 flex-1 flex-col">
            <Topbar onMenuClick={() => setMobileNavOpen(true)} />

            <main className="min-w-0 flex-1 overflow-y-auto">
              <div className="mx-auto w-full max-w-[1440px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
                {children}
              </div>
            </main>
          </section>

          <CommandPalette />
        </div>
      </IndustryThemeProvider>
    </OrganizationProvider>
  );
}
