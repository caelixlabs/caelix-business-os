'use client';

import { useRouter } from 'next/navigation';

import { useLogin } from '@/features/auth/api/use-auth';
import { LoginForm } from '../components/login-form';

export function LoginView() {
  const login = useLogin();
  const router = useRouter();

  return (
    <LoginForm
      loading={login.isPending}
      onSubmit={(values) =>
        login.mutate(values, {
          onSuccess: () => router.replace('/dashboard'),
        })
      }
    />
  );
}
