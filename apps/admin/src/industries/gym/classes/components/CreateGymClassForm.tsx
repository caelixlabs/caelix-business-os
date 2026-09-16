'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateGymClass } from '@/features/gym/classes/api/use-gym-classes';
import { createGymClassSchema, weekdayValues, type CreateGymClassFormValues } from '@/features/gym/classes/schemas/gym-class.schema';
import { useBranches } from '@/features/branches/api/use-branches';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

export function CreateGymClassForm({ organizationId, onDone }: { organizationId: string; onDone: () => void }) {
  const createClass = useCreateGymClass(organizationId);
  const { data: branches } = useBranches(organizationId);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateGymClassFormValues>({
    resolver: zodResolver(createGymClassSchema),
    defaultValues: { capacity: 20, days: [] },
  });

  const branchId = watch('branchId');
  const days = watch('days') ?? [];

  const toggleDay = (day: (typeof weekdayValues)[number]) => {
    setValue('days', days.includes(day) ? days.filter((d) => d !== day) : [...days, day], { shouldValidate: true });
  };

  return (
    <form
      onSubmit={handleSubmit((values) => createClass.mutate(values, { onSuccess: onDone }))}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text">Branch</span>
        <Select value={branchId ?? ''} onValueChange={(value) => setValue('branchId', value, { shouldValidate: true })}>
          <SelectTrigger>{branches?.find((b) => b.id === branchId)?.name ?? 'Select a branch'}</SelectTrigger>
          <SelectContent>
            {(branches ?? []).map((branch) => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.branchId && <p className="text-xs text-danger">{errors.branchId.message}</p>}
      </div>

      <Field label="Class name" htmlFor="name" error={errors.name?.message}>
        <Input id="name" autoFocus placeholder="e.g. Morning HIIT" {...register('name')} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Capacity" htmlFor="capacity" error={errors.capacity?.message}>
          <Input id="capacity" type="number" min={1} {...register('capacity')} />
        </Field>
        <Field label="Start date" htmlFor="startDate" error={errors.startDate?.message}>
          <Input id="startDate" type="date" {...register('startDate')} />
        </Field>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text">Days</span>
        <div className="flex flex-wrap gap-1.5">
          {weekdayValues.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                days.includes(day)
                  ? 'border-accent bg-accent text-white'
                  : 'border-border text-text-secondary hover:border-accent/40'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
        {errors.days && <p className="text-xs text-danger">{errors.days.message as string}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Start time" htmlFor="startTime" error={errors.startTime?.message}>
          <Input id="startTime" type="time" {...register('startTime')} />
        </Field>
        <Field label="End time" htmlFor="endTime" error={errors.endTime?.message}>
          <Input id="endTime" type="time" {...register('endTime')} />
        </Field>
      </div>

      <Button type="submit" loading={createClass.isPending}>
        Create class
      </Button>
    </form>
  );
}
