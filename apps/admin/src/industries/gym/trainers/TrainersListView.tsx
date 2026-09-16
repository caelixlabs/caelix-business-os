'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useUsers } from '@/features/users/api/use-users';
import { useGymClasses } from '@/features/gym/classes/api/use-gym-classes';
import type { AppUser } from '@/features/auth/types';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data/data-table';

export function TrainersListView() {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;
  const { data: users, isLoading } = useUsers(organizationId);
  const { data: classes } = useGymClasses(organizationId);

  const trainers = (users ?? []).filter((user) => user.role?.name?.toUpperCase().includes('TRAINER'));

  const classCount = (trainerId: string) => classes?.filter((c) => c.trainerUserId === trainerId).length ?? 0;

  const columns: ColumnDef<AppUser, unknown>[] = [
    { accessorKey: 'fullName', header: 'Trainer' },
    { accessorKey: 'email', header: 'Email' },
    {
      id: 'classes',
      header: 'Active classes',
      accessorFn: (row) => classCount(row.id),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return <Badge tone={value === 'ACTIVE' ? 'success' : 'neutral'}>{value.toLowerCase()}</Badge>;
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Trainers"
        description="Staff assigned to lead classes. Invite trainers from People & roles."
      />

      <DataTable
        columns={columns}
        data={trainers}
        loading={isLoading}
        searchPlaceholder="Search trainers..."
        emptyTitle="No trainers yet"
        emptyDescription="Invite a user and assign them the Trainer role from People & roles."
      />
    </div>
  );
}
