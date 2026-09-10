'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/store/auth.store';
import { useOrganization } from '@/features/organizations/api/use-organizations';
import { Sidebar } from '@/components/layout/sidebar';
import { Spinner } from '@/components/ui/spinner';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const router = useRouter();
  const { data: organization } = useOrganization(user?.organizationId);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex h-screen items-center justify-center bg-canvas">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <Sidebar organization={organization ?? null} />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
