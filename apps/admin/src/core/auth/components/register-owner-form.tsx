'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { registerOwnerSchema, type RegisterOwnerFormValues } from '@/features/auth/schemas/auth.schema';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export function RegisterOwnerForm({ loading, onSubmit }: { loading: boolean; onSubmit: (values: RegisterOwnerFormValues) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterOwnerFormValues>({ resolver: zodResolver(registerOwnerSchema) });

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="First name" htmlFor="firstName" error={errors.firstName?.message}>
            <Input id="firstName" autoFocus {...register('firstName')} />
          </Field>
          <Field label="Last name" htmlFor="lastName" error={errors.lastName?.message}>
            <Input id="lastName" {...register('lastName')} />
          </Field>
        </div>
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" {...register('email')} />
        </Field>
        <Field label="Password" htmlFor="password" hint="At least 8 characters" error={errors.password?.message}>
          <Input id="password" type="password" {...register('password')} />
        </Field>
        <Button type="submit" loading={loading} className="mt-1 w-full">Create account</Button>
      </form>
    </Card>
  );
}
