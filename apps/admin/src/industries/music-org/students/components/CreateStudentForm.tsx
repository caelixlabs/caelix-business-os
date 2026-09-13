'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateMusicStudent } from '@/features/music/students/api/use-students';
import {
  createStudentSchema,
  musicSkillLevelValues,
  type CreateStudentFormValues,
} from '@/features/music/students/schemas/student.schema';
import { useBranches } from '@/features/branches/api/use-branches';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

export function CreateStudentForm({ organizationId, onDone }: { organizationId: string; onDone: () => void }) {
  const createStudent = useCreateMusicStudent(organizationId);
  const { data: branches } = useBranches(organizationId);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateStudentFormValues>({ resolver: zodResolver(createStudentSchema) });

  const skillLevel = watch('skillLevel');
  const branchId = watch('branchId');

  return (
    <form
      onSubmit={handleSubmit((values) =>
        createStudent.mutate(
          { ...values, email: values.email || undefined, guardianEmail: values.guardianEmail || undefined },
          { onSuccess: onDone },
        ),
      )}
      className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" htmlFor="firstName" error={errors.firstName?.message}>
          <Input id="firstName" autoFocus {...register('firstName')} />
        </Field>
        <Field label="Last name" htmlFor="lastName" error={errors.lastName?.message}>
          <Input id="lastName" {...register('lastName')} />
        </Field>
      </div>

      <Field label="Student number" htmlFor="studentNo" hint="A unique identifier, e.g. STU-0042" error={errors.studentNo?.message}>
        <Input id="studentNo" {...register('studentNo')} />
      </Field>

      {branches && branches.length > 1 && (
        <Field label="Branch" htmlFor="branchId">
          <Select value={branchId ?? ''} onValueChange={(value) => setValue('branchId', value)}>
            <SelectTrigger id="branchId">
              {branches.find((branch) => branch.id === branchId)?.name ?? 'Select a branch'}
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" {...register('email')} />
        </Field>
        <Field label="Phone" htmlFor="phone" error={errors.phone?.message}>
          <Input id="phone" {...register('phone')} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Instrument" htmlFor="instrument" error={errors.instrument?.message}>
          <Input id="instrument" placeholder="Guitar, Piano..." {...register('instrument')} />
        </Field>
        <Field label="Skill level" htmlFor="skillLevel">
          <Select value={skillLevel ?? ''} onValueChange={(value) => setValue('skillLevel', value as CreateStudentFormValues['skillLevel'])}>
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
        <Field label="Guardian name" htmlFor="guardianName" error={errors.guardianName?.message}>
          <Input id="guardianName" {...register('guardianName')} />
        </Field>
        <Field label="Guardian phone" htmlFor="guardianPhone" error={errors.guardianPhone?.message}>
          <Input id="guardianPhone" {...register('guardianPhone')} />
        </Field>
      </div>

      <Field label="Notes" htmlFor="notes" error={errors.notes?.message}>
        <Input id="notes" {...register('notes')} />
      </Field>

      <Button type="submit" loading={createStudent.isPending}>
        Add student
      </Button>
    </form>
  );
}
