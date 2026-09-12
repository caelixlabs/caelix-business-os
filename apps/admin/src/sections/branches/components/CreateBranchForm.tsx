'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateBranch } from '@/features/branches/api/use-branches';
import { createBranchSchema, type CreateBranchFormValues } from '@/features/branches/schemas/branch.schema';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';

export function CreateBranchForm({ organizationId, onDone }: { organizationId: string; onDone: () => void }) {
  const createBranch = useCreateBranch(organizationId);
  const { register, handleSubmit, formState: { errors } } = useForm<CreateBranchFormValues>({ resolver: zodResolver(createBranchSchema) });
  return (
    <form onSubmit={handleSubmit((values) => createBranch.mutate(values, { onSuccess: onDone }))} className="flex flex-col gap-4">
      <Field label="Branch name" htmlFor="name" error={errors.name?.message}><Input id="name" placeholder="Downtown Studio" autoFocus {...register('name')} /></Field>
      <Field label="Code" htmlFor="code" hint="Short identifier, e.g. DTOWN" error={errors.code?.message}><Input id="code" {...register('code')} /></Field>
      <Button type="submit" loading={createBranch.isPending}>Create branch</Button>
    </form>
  );
}
