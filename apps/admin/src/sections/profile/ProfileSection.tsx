'use client';

import { UserCircle } from 'lucide-react';

import { useAuthStore } from '@/store/auth.store';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';

export default function ProfileSection() {
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      <PageHeader
        title="My profile"
        description="Your Caelix account details and access context."
      />

      <Card className="max-w-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent-ink">
            <UserCircle className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-text">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-sm text-text-secondary">{user?.email}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-text-secondary">Account status</p>
            <p className="mt-1 text-sm font-medium text-text">{user?.status}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-text-secondary">Organization ID</p>
            <p className="mt-1 truncate font-mono text-xs text-text-secondary">
              {user?.organizationId}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
