'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateMusicCourse } from '@/features/music/courses/api/use-courses';
import {
  createCourseSchema,
  musicSkillLevelValues,
  type CreateCourseFormValues,
} from '@/features/music/courses/schemas/course.schema';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

export function CreateCourseForm({ organizationId, onDone }: { organizationId: string; onDone: () => void }) {
  const createCourse = useCreateMusicCourse(organizationId);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateCourseFormValues>({ resolver: zodResolver(createCourseSchema) });

  const skillLevel = watch('skillLevel');

  return (
    <form onSubmit={handleSubmit((values) => createCourse.mutate(values, { onSuccess: onDone }))} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Course code" htmlFor="code" hint="e.g. GTR-101" error={errors.code?.message}>
          <Input id="code" autoFocus {...register('code')} />
        </Field>
        <Field label="Course name" htmlFor="name" error={errors.name?.message}>
          <Input id="name" {...register('name')} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Instrument" htmlFor="instrument" error={errors.instrument?.message}>
          <Input id="instrument" {...register('instrument')} />
        </Field>
        <Field label="Skill level" htmlFor="skillLevel">
          <Select value={skillLevel ?? ''} onValueChange={(value) => setValue('skillLevel', value as CreateCourseFormValues['skillLevel'])}>
            <SelectTrigger id="skillLevel">{skillLevel ? skillLevel.toLowerCase() : 'Beginner'}</SelectTrigger>
            <SelectContent>
              {musicSkillLevelValues.map((level) => (
                <SelectItem key={level} value={level}>
                  {level.charAt(0) + level.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Duration (weeks)" htmlFor="durationWeeks" error={errors.durationWeeks?.message}>
          <Input id="durationWeeks" type="number" min={1} {...register('durationWeeks')} />
        </Field>
        <Field label="Class length (minutes)" htmlFor="classDurationMinutes" error={errors.classDurationMinutes?.message}>
          <Input id="classDurationMinutes" type="number" min={1} placeholder="60" {...register('classDurationMinutes')} />
        </Field>
      </div>

      <Field label="Description" htmlFor="description" error={errors.description?.message}>
        <Input id="description" {...register('description')} />
      </Field>

      <Button type="submit" loading={createCourse.isPending}>
        Create course
      </Button>
    </form>
  );
}
