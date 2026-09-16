'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/auth.schema';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';

export function LoginForm({ loading, onSubmit }: { loading: boolean; onSubmit: (values: LoginFormValues) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  return (
    <>
      <div className="mb-7">
        <h1 className="text-xl font-semibold text-text">Sign in</h1>
        <p className="mt-1 text-sm text-text-secondary">Access your organization&apos;s workspace.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Field label="Organization" htmlFor="organizationSlug" hint="Your organization identifier, e.g. acme-gym" error={errors.organizationSlug?.message}>
          <Input id="organizationSlug" placeholder="acme-gym" autoFocus {...register('organizationSlug')} />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" placeholder="you@company.com" {...register('email')} />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password?.message}>
          <Input id="password" type="password" placeholder="••••••••••" {...register('password')} />
        </Field>
        <Button type="submit" loading={loading} className="mt-1 w-full">Sign in</Button>
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Setting up Caelix for the first time?{' '}
        <Link href="/signup" className="font-medium text-accent hover:underline">Create your organization</Link>
      </p>
    </>
  );
}
