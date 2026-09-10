'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuthStore } from '@/store/auth.store';
import { useUsers, useInviteUser, useAssignRole } from '@/features/users/api/use-users';
import { useRoles } from '@/features/rbac/api/use-roles';
import { inviteUserSchema, type InviteUserFormValues } from '@/features/users/schemas/invite-user.schema';

import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { PermissionGate } from '@/components/auth/permission-gate';
import { AppUser } from '@/features/auth/types';

export default function UsersPage() {
  const user = useAuthStore((s) => s.user);
  const organizationId = user?.organizationId;
  const { data: users, isLoading } = useUsers(organizationId);
  const { data: roles } = useRoles(organizationId);
  const assignRole = useAssignRole(organizationId ?? '');
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title="Users"
        description="Everyone with access to your organization."
        action={
          <PermissionGate permission="user:invite">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>Invite user</Button>
              </DialogTrigger>
              <DialogContent
                title="Invite a teammate"
                description="They'll sign in with this email and temporary password — share it with them directly."
              >
                {organizationId && (
                  <InviteUserForm organizationId={organizationId} onDone={() => setDialogOpen(false)} />
                )}
              </DialogContent>
            </Dialog>
          </PermissionGate>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : !users || users.length === 0 ? (
        <EmptyState title="No users yet" />
      ) : (
        <Card>
          <table className="w-full text-left text-sm">
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
              {users.map((u: AppUser) => (
                <tr key={u.id}>
                  <td className="px-5 py-3.5 font-medium text-text">{u.fullName}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-text-secondary">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <PermissionGate
                      permission="user:role-assign"
                      fallback={
                        <span className="text-sm text-text-secondary">
                          {u.role?.name ?? 'No role'}
                        </span>
                      }
                    >
                      <Select
                        value={u.role?.id}
                        onValueChange={(roleId) => assignRole.mutate({ userId: u.id, roleId })}
                      >
                        <SelectTrigger className="w-36 !py-1.5 text-xs">
                          {u.role?.name ?? 'No role'}
                        </SelectTrigger>
                        <SelectContent>
                          {(roles ?? []).map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </PermissionGate>
                  </td>
                  <td className="px-5 py-3.5 text-text-secondary">
                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

function InviteUserForm({ organizationId, onDone }: { organizationId: string; onDone: () => void }) {
  const inviteUser = useInviteUser(organizationId);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteUserFormValues>({ resolver: zodResolver(inviteUserSchema) });

  function onSubmit(values: InviteUserFormValues) {
    inviteUser.mutate(values, { onSuccess: onDone });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="First name" htmlFor="firstName" error={errors.firstName?.message}>
          <Input id="firstName" autoFocus {...register('firstName')} />
        </Field>
        <Field label="Last name" htmlFor="lastName" error={errors.lastName?.message}>
          <Input id="lastName" {...register('lastName')} />
        </Field>
      </div>
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" {...register('email')} />
      </Field>
      <Field
        label="Temporary password"
        htmlFor="temporaryPassword"
        hint="Share this with them directly — there's no email invite flow yet"
        error={errors.temporaryPassword?.message}
      >
        <Input id="temporaryPassword" type="text" {...register('temporaryPassword')} />
      </Field>
      <Button type="submit" loading={inviteUser.isPending} className="mt-1">
        Send invite
      </Button>
    </form>
  );
}
