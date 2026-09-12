import { ShieldCheck } from 'lucide-react';
import type { RoleSummary } from '@/features/auth/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PERMISSIONS: Record<string, string[]> = {
  OWNER: ['organization:*', 'branch:*', 'user:*'],
  ADMIN: ['organization:read', 'organization:update', 'branch:create', 'branch:read', 'branch:update', 'branch:archive', 'user:read', 'user:invite', 'user:update', 'user:suspend', 'user:role-assign'],
  MANAGER: ['organization:read', 'branch:read', 'branch:update', 'user:read'],
  EMPLOYEE: ['organization:read', 'branch:read', 'user:read'],
  VIEWER: ['organization:read', 'branch:read'],
};

export function RoleCard({ role }: { role: RoleSummary }) {
  return (
    <Card className="p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft">
          <ShieldCheck className="h-4 w-4 text-accent" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-text">{role.name}</h2>
            <Badge tone="neutral">{role.level}</Badge>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(PERMISSIONS[role.level] ?? role.permissions ?? []).map((permission) => (
              <span key={permission} className="rounded-md border border-border bg-canvas px-2.5 py-1 font-mono text-[11px] text-text-secondary">
                {permission}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
