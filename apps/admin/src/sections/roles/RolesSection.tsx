'use client';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useRoles } from '@/features/rbac/api/use-roles';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import type { RoleSummary } from '@/features/auth/types';
import { RoleCard } from './components/RoleCard';

const ORDER: RoleSummary['level'][] = ['OWNER', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'VIEWER'];

export default function RolesSection() {
  const { organization } = useOrganizationContext();
  const { data: roles, isLoading, isError } = useRoles(organization?.id);

  return (
    <div>
      <PageHeader title="Roles & permissions" description="View the system roles and permissions granted to each role." />
      {isLoading ? <div className="flex justify-center py-16"><Spinner /></div> : isError ? <EmptyState title="Could not load roles" description="Please refresh the page and try again." /> : !roles?.length ? <EmptyState title="No roles found" description="System roles should be created automatically when an organization is created." /> : <div className="grid gap-4">{roles.slice().sort((a, b) => ORDER.indexOf(a.level) - ORDER.indexOf(b.level)).map((role) => <RoleCard key={role.id} role={role} />)}</div>}
    </div>
  );
}
