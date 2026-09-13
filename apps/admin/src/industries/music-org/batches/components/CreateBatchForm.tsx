'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateMusicBatch } from '@/features/music/batches/api/use-batches';
import { createBatchSchema, type CreateBatchFormValues } from '@/features/music/batches/schemas/batch.schema';
import { WEEKDAYS } from '@/features/music/batches/types';
import { useMusicCourses } from '@/features/music/courses/api/use-courses';
import { useBranches } from '@/features/branches/api/use-branches';
import { useUsers } from '@/features/users/api/use-users';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

export function CreateBatchForm({ organizationId, onDone }: { organizationId: string; onDone: () => void }) {
  const createBatch = useCreateMusicBatch(organizationId);
  const { data: courses } = useMusicCourses(organizationId);
  const { data: branches } = useBranches(organizationId);
  const { data: users } = useUsers(organizationId);
  const teachers = (users ?? []).filter((user) => user.role?.name?.toUpperCase().includes('TEACHER'));

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateBatchFormValues>({
    resolver: zodResolver(createBatchSchema),
    defaultValues: { days: [] },
  });

  const courseId = watch('courseId');
  const branchId = watch('branchId');
  const teacherUserId = watch('teacherUserId');
  const days = watch('days') ?? [];

  function toggleDay(day: (typeof WEEKDAYS)[number]) {
    setValue('days', days.includes(day) ? days.filter((d) => d !== day) : [...days, day], { shouldValidate: true });
  }

  return (
    <form
      onSubmit={handleSubmit((values) =>
        createBatch.mutate({ ...values, endDate: values.endDate || undefined }, { onSuccess: onDone }),
      )}
      className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1"
    >
      <Field label="Batch name" htmlFor="name" error={errors.name?.message}>
        <Input id="name" placeholder="Evening Guitar - Batch A" autoFocus {...register('name')} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Course" htmlFor="courseId" error={errors.courseId?.message}>
          <Select value={courseId ?? ''} onValueChange={(value) => setValue('courseId', value, { shouldValidate: true })}>
            <SelectTrigger id="courseId">
              {courses?.find((course) => course.id === courseId)?.name ?? 'Select a course'}
            </SelectTrigger>
            <SelectContent>
              {(courses ?? []).map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Branch" htmlFor="branchId" error={errors.branchId?.message}>
          <Select value={branchId ?? ''} onValueChange={(value) => setValue('branchId', value, { shouldValidate: true })}>
            <SelectTrigger id="branchId">
              {branches?.find((branch) => branch.id === branchId)?.name ?? 'Select a branch'}
            </SelectTrigger>
            <SelectContent>
              {(branches ?? []).map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field label="Teacher" htmlFor="teacherUserId" hint="Optional — can be assigned later">
        <Select value={teacherUserId ?? ''} onValueChange={(value) => setValue('teacherUserId', value)}>
          <SelectTrigger id="teacherUserId">
            {teachers.find((teacher) => teacher.id === teacherUserId)?.fullName ?? 'Unassigned'}
          </SelectTrigger>
          <SelectContent>
            {teachers.map((teacher) => (
              <SelectItem key={teacher.id} value={teacher.id}>
                {teacher.fullName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Start date" htmlFor="startDate" error={errors.startDate?.message}>
          <Input id="startDate" type="date" {...register('startDate')} />
        </Field>
        <Field label="End date" htmlFor="endDate" hint="Optional" error={errors.endDate?.message}>
          <Input id="endDate" type="date" {...register('endDate')} />
        </Field>
      </div>

      <Field label="Capacity" htmlFor="capacity" hint="Defaults to 20" error={errors.capacity?.message}>
        <Input id="capacity" type="number" min={1} placeholder="20" {...register('capacity')} />
      </Field>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text">Days</span>
        <div className="flex flex-wrap gap-2">
          {WEEKDAYS.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                days.includes(day)
                  ? 'border-accent bg-accent-soft text-accent-ink'
                  : 'border-border text-text-secondary hover:border-accent/40'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
        {errors.days && <p className="text-xs text-danger">{errors.days.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Start time" htmlFor="startTime" error={errors.startTime?.message}>
          <Input id="startTime" type="time" {...register('startTime')} />
        </Field>
        <Field label="End time" htmlFor="endTime" error={errors.endTime?.message}>
          <Input id="endTime" type="time" {...register('endTime')} />
        </Field>
      </div>

      <Button type="submit" loading={createBatch.isPending}>
        Create batch
      </Button>
    </form>
  );
}
