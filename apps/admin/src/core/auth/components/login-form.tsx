'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/auth.schema';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export function LoginForm({ loading, onSubmit }: { loading: boolean; onSubmit: (values: LoginFormValues) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  return (
    <>
      <div className="mb-8 flex flex-col items-center gap-3">
        <Image src="/brand/caelix-business-os-lockup.png" alt="Caelix Business OS" width={120} height={120} priority />
        <div className="text-center">
          <h1 className="text-lg font-semibold text-text">Sign in to Caelix</h1>
          <p className="mt-1 text-xs text-text-secondary">Access your organization workspace.</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Field label="Organization" htmlFor="organizationSlug" hint="Your organization identifier, e.g. acme-gym" error={errors.organizationSlug?.message}>
            <Input id="organizationSlug" placeholder="acme-gym" autoFocus {...register('organizationSlug')} />
          </Field>
          <Field label="Email" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" {...register('email')} />
          </Field>
          <Field label="Password" htmlFor="password" error={errors.password?.message}>
            <Input id="password" type="password" {...register('password')} />
          </Field>
          <Button type="submit" loading={loading} className="mt-1 w-full">Sign in</Button>
        </form>
      </Card>

      <p className="mt-4 text-center text-sm text-text-secondary">
        Setting up Caelix for the first time?{' '}
        <Link href="/signup" className="font-medium text-accent hover:underline">Create your organization</Link>
      </p>
    </>
  );
}
