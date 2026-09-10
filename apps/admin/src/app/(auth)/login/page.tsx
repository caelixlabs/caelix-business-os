'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useLogin } from '@/features/auth/api/use-auth';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas/auth.schema';

import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function LoginPage() {
  const login = useLogin();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  function onSubmit(values: LoginFormValues) {
    login.mutate(values, { onSuccess: () => router.replace('/dashboard') });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image
            src="/brand/caelix-business-os-lockup.png"
            alt="Caelix Business OS"
            width={140}
            height={140}
            priority
          />
          {/* <h1 className="text-lg font-semibold text-text">Sign in to your console</h1> */}
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Field
              label="Organization"
              htmlFor="organizationSlug"
              hint="Your organization's short identifier, e.g. acme-gym"
              error={errors.organizationSlug?.message}
            >
              <Input
                id="organizationSlug"
                placeholder="acme-gym"
                autoFocus
                {...register('organizationSlug')}
              />
            </Field>

            <Field label="Email" htmlFor="email" error={errors.email?.message}>
              <Input id="email" type="email" {...register('email')} />
            </Field>

            <Field label="Password" htmlFor="password" error={errors.password?.message}>
              <Input id="password" type="password" {...register('password')} />
            </Field>

            <Button type="submit" loading={login.isPending} className="mt-1 w-full">
              Sign in
            </Button>
          </form>
        </Card>

        <p className="mt-4 text-center text-sm text-text-secondary">
          Setting up Caelix for the first time?{' '}
          <Link href="/signup" className="font-medium text-accent hover:underline">
            Create your organization
          </Link>
        </p>
      </div>
    </div>
  );
}
