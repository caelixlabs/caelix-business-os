'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateGymMember } from '@/features/gym/members/api/use-gym-members';
import { createGymMemberSchema, type CreateGymMemberFormValues } from '@/features/gym/members/schemas/gym-member.schema';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';

export function CreateGymMemberForm({ organizationId, onDone }: { organizationId: string; onDone: () => void }) {
  const createMember = useCreateGymMember(organizationId);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGymMemberFormValues>({
    resolver: zodResolver(createGymMemberSchema),
  });

  return (
    <form
      onSubmit={handleSubmit((values) =>
        createMember.mutate({ ...values, email: values.email || undefined }, { onSuccess: onDone }),
      )}
      className="flex flex-col gap-4"
    >
      <Field label="Member number" htmlFor="memberNo" error={errors.memberNo?.message}>
        <Input id="memberNo" autoFocus {...register('memberNo')} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="First name" htmlFor="firstName" error={errors.firstName?.message}>
          <Input id="firstName" {...register('firstName')} />
        </Field>
        <Field label="Last name" htmlFor="lastName" error={errors.lastName?.message}>
          <Input id="lastName" {...register('lastName')} />
        </Field>
      </div>

      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" {...register('email')} />
      </Field>

      <Field label="Phone" htmlFor="phone" error={errors.phone?.message}>
        <Input id="phone" {...register('phone')} />
      </Field>

      <Button type="submit" loading={createMember.isPending}>
        Add member
      </Button>
    </form>
  );
}
