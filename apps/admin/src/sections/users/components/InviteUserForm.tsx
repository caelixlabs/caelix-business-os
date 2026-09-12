'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useInviteUser } from '@/features/users/api/use-users';
import { inviteUserSchema, type InviteUserFormValues } from '@/features/users/schemas/invite-user.schema';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';

export function InviteUserForm({ organizationId, onDone }: { organizationId: string; onDone: () => void }) {
  const inviteUser = useInviteUser(organizationId);
  const { register, handleSubmit, formState: { errors } } = useForm<InviteUserFormValues>({ resolver: zodResolver(inviteUserSchema) });
  return (
    <form onSubmit={handleSubmit((values) => inviteUser.mutate(values, { onSuccess: onDone }))} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="First name" htmlFor="firstName" error={errors.firstName?.message}><Input id="firstName" autoFocus {...register('firstName')} /></Field>
        <Field label="Last name" htmlFor="lastName" error={errors.lastName?.message}><Input id="lastName" {...register('lastName')} /></Field>
      </div>
      <Field label="Email" htmlFor="email" error={errors.email?.message}><Input id="email" type="email" {...register('email')} /></Field>
      <Field label="Temporary password" htmlFor="temporaryPassword" hint="Share this directly. Email invitation delivery is not implemented yet." error={errors.temporaryPassword?.message}>
        <Input id="temporaryPassword" type="text" {...register('temporaryPassword')} />
      </Field>
      <Button type="submit" loading={inviteUser.isPending}>Send invite</Button>
    </form>
  );
}
