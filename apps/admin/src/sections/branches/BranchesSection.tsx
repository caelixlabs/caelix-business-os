'use client';

import { useState } from 'react';
import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useBranches, useToggleBranchStatus, useDeleteBranch } from '@/features/branches/api/use-branches';
import type { Branch } from '@/features/branches/types';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { StatusBadge, StatusRail } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { PermissionGate } from '@/core/access/components/permission-gate';
import { CreateBranchForm } from './components/CreateBranchForm';
import { EditBranchDialog } from './components/EditBranchDialog';

export default function BranchesSection() {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;
  const { data: branches, isLoading } = useBranches(organizationId);
  const toggleStatus = useToggleBranchStatus(organizationId ?? '');
  const deleteBranch = useDeleteBranch(organizationId ?? '');
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div>
      <PageHeader title="Branches" description="Locations or business units within your organization." action={
        <PermissionGate permission="branch:create">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild><Button>New branch</Button></DialogTrigger>
            <DialogContent title="Create a branch" description="Add a new location or business unit.">
              {organizationId && <CreateBranchForm organizationId={organizationId} onDone={() => setDialogOpen(false)} />}
            </DialogContent>
          </Dialog>
        </PermissionGate>
      } />

      {isLoading ? <div className="flex justify-center py-16"><Spinner /></div> : !branches || branches.length === 0 ? (
        <EmptyState title="No branches yet" description="Every organization gets a primary branch automatically." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {branches.map((branch: Branch) => {
            const status = branch.type === 'PRIMARY' ? 'PRIMARY' : branch.status;
            return (
              <Card key={branch.id} className="p-4">
                <StatusRail status={status}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0"><p className="truncate text-sm font-medium text-text">{branch.name}</p><p className="font-mono text-xs text-text-secondary">{branch.code}</p>{branch.description && <p className="mt-2 text-xs text-text-secondary">{branch.description}</p>}</div>
                    <StatusBadge status={status} />
                  </div>
                  <div className="mt-3 flex gap-2">
                    {organizationId && <PermissionGate permission="branch:update"><EditBranchDialog branch={branch} organizationId={organizationId} /></PermissionGate>}
                    {branch.type !== 'PRIMARY' && <>
                      <PermissionGate permission="branch:archive"><Button variant="ghost" className="!px-2 !py-1 text-xs" disabled={toggleStatus.isPending} onClick={() => toggleStatus.mutate({ id: branch.id, nextStatus: branch.status === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE' })}>{branch.status === 'ACTIVE' ? 'Archive' : 'Activate'}</Button></PermissionGate>
                      {branch.status === 'ARCHIVED' && <PermissionGate permission="branch:delete"><Button variant="danger" className="!px-2 !py-1 text-xs" disabled={deleteBranch.isPending} onClick={() => { if (window.confirm(`Delete "${branch.name}" permanently?`)) deleteBranch.mutate(branch.id); }}>Delete</Button></PermissionGate>}
                    </>}
                  </div>
                </StatusRail>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
