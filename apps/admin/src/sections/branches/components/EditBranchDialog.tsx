'use client';

import { useState } from 'react';
import type { Branch } from '@/features/branches/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { EditBranchForm } from './EditBranchForm';

export function EditBranchDialog({ branch, organizationId }: { branch: Branch; organizationId: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="ghost" className="!px-2 !py-1 text-xs">Edit</Button></DialogTrigger>
      <DialogContent title="Edit branch" description={`Update ${branch.name}.`}>
        <EditBranchForm branch={branch} organizationId={organizationId} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
