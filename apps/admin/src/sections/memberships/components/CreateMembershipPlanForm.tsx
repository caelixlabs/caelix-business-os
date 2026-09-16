'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateMembershipPlan } from '@/features/memberships/api/use-memberships';
import {
  createMembershipPlanSchema,
  type CreateMembershipPlanFormValues,
} from '@/features/memberships/schemas/membership.schema';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';

export function CreateMembershipPlanForm({ organizationId, onDone }: { organizationId: string; onDone: () => void }) {
  const createPlan = useCreateMembershipPlan(organizationId);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateMembershipPlanFormValues>({
    resolver: zodResolver(createMembershipPlanSchema),
  });

  return (
    <form
      onSubmit={handleSubmit((values) => createPlan.mutate(values, { onSuccess: onDone }))}
      className="flex flex-col gap-4"
    >
      <Field label="Plan name" htmlFor="name" error={errors.name?.message}>
        <Input id="name" autoFocus placeholder="e.g. Monthly Unlimited" {...register('name')} />
      </Field>

      <Field label="Description" htmlFor="description" error={errors.description?.message}>
        <Input id="description" {...register('description')} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Price (₹)" htmlFor="price" error={errors.price?.message}>
          <Input id="price" type="number" min={0} step="0.01" {...register('price')} />
        </Field>
        <Field label="Duration (days)" htmlFor="durationDays" error={errors.durationDays?.message}>
          <Input id="durationDays" type="number" min={1} {...register('durationDays')} />
        </Field>
      </div>

      <Field label="Sessions included (optional)" htmlFor="sessionsIncluded" error={errors.sessionsIncluded?.message}>
        <Input id="sessionsIncluded" type="number" min={1} placeholder="Leave blank for unlimited" {...register('sessionsIncluded')} />
      </Field>

      <Button type="submit" loading={createPlan.isPending}>
        Create plan
      </Button>
    </form>
  );
}
