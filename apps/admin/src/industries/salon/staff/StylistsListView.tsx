'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useUsers } from '@/features/users/api/use-users';
import type { AppUser } from '@/features/auth/types';
import { PageHeader } from '@/components/ui/page-header';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/data/data-table';

export function StylistsListView() {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;
  const { data: users, isLoading } = useUsers(organizationId);

  const stylists = (users ?? []).filter((user) => user.role?.name?.toUpperCase().includes('STYLIST'));

  const columns: ColumnDef<AppUser, unknown>[] = [
    { accessorKey: 'fullName', header: 'Stylist' },
    { accessorKey: 'email', header: 'Email' },
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
        title="Stylists"
        description="Staff who take appointments and ring up checkout. Invite stylists from People & roles."
      />

      <DataTable
        columns={columns}
        data={stylists}
        loading={isLoading}
        searchPlaceholder="Search stylists..."
        emptyTitle="No stylists yet"
        emptyDescription="Invite a user and assign them the Stylist role from People & roles."
      />
    </div>
  );
}
