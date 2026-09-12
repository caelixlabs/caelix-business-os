'use client';

import type { AppUser } from '@/features/auth/types';
import type { RoleSummary } from '@/features/auth/types';
import { useAssignRole } from '@/features/users/api/use-users';
import { StatusBadge } from '@/components/ui/badge';
import { PermissionGate } from '@/core/access/components/permission-gate';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

export function UserTable({ users, roles, organizationId }: { users: AppUser[]; roles: RoleSummary[]; organizationId: string }) {
  const assignRole = useAssignRole(organizationId);
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
      <table className="min-w-[720px] w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-text-secondary">
            <th className="px-5 py-3 font-medium">Name</th>
            <th className="px-5 py-3 font-medium">Email</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Role</th>
            <th className="px-5 py-3 font-medium">Last login</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-5 py-3.5 font-medium text-text">{user.fullName}</td>
              <td className="px-5 py-3.5 font-mono text-xs text-text-secondary">{user.email}</td>
              <td className="px-5 py-3.5"><StatusBadge status={user.status} /></td>
              <td className="px-5 py-3.5">
                <PermissionGate permission="user:role-assign" fallback={<span className="text-text-secondary">{user.role?.name ?? 'No role'}</span>}>
                  <Select value={user.role?.id} onValueChange={(roleId) => assignRole.mutate({ userId: user.id, roleId })}>
                    <SelectTrigger className="w-36 !py-1.5 text-xs">{user.role?.name ?? 'No role'}</SelectTrigger>
                    <SelectContent>{roles.map((role) => <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>)}</SelectContent>
                  </Select>
                </PermissionGate>
              </td>
              <td className="px-5 py-3.5 text-text-secondary">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
