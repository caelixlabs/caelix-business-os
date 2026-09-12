import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';


import { useAuthStore } from '@/store/auth.store';
import { ApiError } from '@/api/client';
import { LoginPayload, RegisterPayload } from '../types';
import { authApi } from './auth.api';

export function useLogin() {
  const applySession = useAuthStore((s) => s.applySession);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (session) => {
      applySession(session);
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not sign in.');
    },
  });
}

export function useRegister() {
  const applySession = useAuthStore((s) => s.applySession);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (session) => {
      applySession(session);
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'Could not create your account.');
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const clearSession = useAuthStore((s) => s.clearSession);

  return useMutation({
    mutationFn: async () => {
      const token = refreshToken;
      clearSession();
      if (token) {
        try {
          await authApi.logout(token);
        } catch {
          // Local session is already cleared; server-side revoke is best-effort.
        }
      }
    },
    onSuccess: () => {
      router.replace('/login');
    },
  });
}
