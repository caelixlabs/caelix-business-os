'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useUsers } from '@/features/users/api/use-users';
import { useMusicBatches } from '@/features/music/batches/api/use-batches';
import type { AppUser } from '@/features/auth/types';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data/data-table';

export function TeachersListView() {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;
  const { data: users, isLoading } = useUsers(organizationId);
  const { data: batches } = useMusicBatches(organizationId);

  const teachers = (users ?? []).filter((user) => user.role?.name?.toUpperCase().includes('TEACHER'));

  const batchCount = (teacherId: string) => batches?.filter((batch) => batch.teacherUserId === teacherId).length ?? 0;

  const columns: ColumnDef<AppUser, unknown>[] = [
    { accessorKey: 'fullName', header: 'Teacher' },
    { accessorKey: 'email', header: 'Email' },
    {
      id: 'batches',
      header: 'Active batches',
      accessorFn: (row) => batchCount(row.id),
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
        title="Teachers"
        description="Staff assigned to teach batches. Invite teachers from People & roles."
      />

      <DataTable
        columns={columns}
        data={teachers}
        loading={isLoading}
        searchPlaceholder="Search teachers..."
        emptyTitle="No teachers yet"
        emptyDescription="Invite a user and assign them the Teacher role from People & roles."
      />
    </div>
  );
}
