'use client';

import { useState } from 'react';
import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useUsers } from '@/features/users/api/use-users';
import { useRoles } from '@/features/rbac/api/use-roles';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { PermissionGate } from '@/core/access/components/permission-gate';
import { UserTable } from './components/UserTable';
import { InviteUserForm } from './components/InviteUserForm';

export default function UsersSection() {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;
  const { data: users, isLoading } = useUsers(organizationId);
  const { data: roles } = useRoles(organizationId);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div>
      <PageHeader title="People" description="Everyone with access to your organization." action={
        <PermissionGate permission="user:invite">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild><Button>Invite user</Button></DialogTrigger>
            <DialogContent title="Invite a teammate" description="Create access with an email and temporary password.">
              {organizationId && <InviteUserForm organizationId={organizationId} onDone={() => setDialogOpen(false)} />}
            </DialogContent>
          </Dialog>
        </PermissionGate>
      } />

      {isLoading ? <div className="flex justify-center py-16"><Spinner /></div> : !users || users.length === 0 ? <EmptyState title="No users yet" /> : organizationId ? <UserTable users={users} roles={roles ?? []} organizationId={organizationId} /> : null}
    </div>
  );
}
