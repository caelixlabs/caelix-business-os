'use client';

import { useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { UserCheck, UserX, Users } from 'lucide-react';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useGymMembers } from '@/features/gym/members/api/use-gym-members';
import type { GymMember } from '@/features/gym/members/types';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data/data-table';
import { StatCard } from '@/components/data/stat-card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { PermissionGate } from '@/core/access/components/permission-gate';
import { formatDate } from '@/lib/format';
import { CreateGymMemberForm } from './components/CreateGymMemberForm';

const STATUS_TONE: Record<string, 'success' | 'neutral' | 'danger' | 'info' | 'accent'> = {
  ACTIVE: 'success',
  INACTIVE: 'neutral',
  FROZEN: 'info',
  CANCELLED: 'danger',
};

export function GymMembersListView() {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;
  const { data: members, isLoading } = useGymMembers(organizationId);
  const [dialogOpen, setDialogOpen] = useState(false);

  const activeCount = members?.filter((m) => m.status === 'ACTIVE').length ?? 0;
  const frozenCount = members?.filter((m) => m.status === 'FROZEN').length ?? 0;
  const inactiveCount = members?.filter((m) => m.status === 'INACTIVE' || m.status === 'CANCELLED').length ?? 0;

  const columns: ColumnDef<GymMember, unknown>[] = [
    { accessorKey: 'memberNo', header: 'Member #' },
    {
      id: 'name',
      header: 'Name',
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    },
    { accessorKey: 'phone', header: 'Phone', cell: ({ getValue }) => (getValue() as string) || '—' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return <Badge tone={STATUS_TONE[value] ?? 'neutral'}>{value.toLowerCase()}</Badge>;
      },
    },
    {
      accessorKey: 'joinedAt',
      header: 'Joined',
      cell: ({ getValue }) => formatDate(getValue() as string),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Members"
        description="Everyone with an active or past membership."
        action={
          <PermissionGate permission="gym:member-create">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>Add member</Button>
              </DialogTrigger>
              <DialogContent title="Add a member" description="Register a new gym member.">
                {organizationId && <CreateGymMemberForm organizationId={organizationId} onDone={() => setDialogOpen(false)} />}
              </DialogContent>
            </Dialog>
          </PermissionGate>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <StatCard title="Active" value={activeCount} description="current members" icon={UserCheck} />
        <StatCard title="Frozen" value={frozenCount} description="paused memberships" icon={Users} />
        <StatCard title="Inactive" value={inactiveCount} description="lapsed or cancelled" icon={UserX} />
      </div>

      <DataTable
        columns={columns}
        data={members ?? []}
        loading={isLoading}
        searchPlaceholder="Search members..."
        emptyTitle="No members yet"
        emptyDescription="Add your first gym member to get started."
      />
    </div>
  );
}
