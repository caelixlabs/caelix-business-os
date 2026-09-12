import { apiPost } from '@/api/client';
import type { AppUser, AuthResponse, LoginPayload, RegisterPayload } from '../types';

export const authApi = {
  login: (payload: LoginPayload) => apiPost<AuthResponse>('/auth/login', payload),
  register: (payload: RegisterPayload) => apiPost<AuthResponse>('/auth/register', payload),
  refresh: (refreshToken: string) => apiPost<AuthResponse>('/auth/refresh', { refreshToken }),
  logout: (refreshToken: string) => apiPost<void>('/auth/logout', { refreshToken }),
};


export type { AuthResponse, AppUser };
