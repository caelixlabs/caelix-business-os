'use client';

import { useForm } from 'react-hook-form';
import { useUpdateBranch } from '@/features/branches/api/use-branches';
import type { Branch } from '@/features/branches/types';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';

export function EditBranchForm({ branch, organizationId, onDone }: { branch: Branch; organizationId: string; onDone: () => void }) {
  const updateBranch = useUpdateBranch(organizationId);
  const { register, handleSubmit } = useForm<{ name: string; description: string }>({ defaultValues: { name: branch.name, description: branch.description ?? '' } });
  return (
    <form onSubmit={handleSubmit((values) => updateBranch.mutate({ id: branch.id, name: values.name, description: values.description || undefined }, { onSuccess: onDone }))} className="flex flex-col gap-4">
      <Field label="Branch name" htmlFor={`edit-name-${branch.id}`}><Input id={`edit-name-${branch.id}`} autoFocus {...register('name', { required: true })} /></Field>
      <Field label="Description" htmlFor={`edit-description-${branch.id}`}><Input id={`edit-description-${branch.id}`} placeholder="Optional description" {...register('description')} /></Field>
      <Button type="submit" loading={updateBranch.isPending}>Save changes</Button>
    </form>
  );
}
