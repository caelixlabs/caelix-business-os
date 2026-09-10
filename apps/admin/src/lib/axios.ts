import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/auth.store';
import type { ApiEnvelope, ApiErrorEnvelope } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const httpClient = axios.create({ baseURL: API_URL });

httpClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshInFlight: Promise<string | null> | null = null;

async function refreshSession(): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = doRefresh().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

async function doRefresh(): Promise<string | null> {
  const refreshToken = useAuthStore.getState().refreshToken ?? useAuthStore.getState().hydrateRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await axios.post<ApiEnvelope<import('@/features/auth/types').AuthResponse>>(
      `${API_URL}/auth/refresh`,
      { refreshToken },
    );
    const session = response.data.data;
    useAuthStore.getState().applySession(session);
    return session.accessToken;
  } catch {
    useAuthStore.getState().clearSession();
    return null;
  }
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorEnvelope>) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retried &&
      useAuthStore.getState().refreshToken
    ) {
      originalRequest._retried = true;
      const newToken = await refreshSession();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return httpClient(originalRequest);
      }
    }

    if (error.response?.status === 401) {
      useAuthStore.getState().clearSession();
    }

    const body = error.response?.data;
    throw new ApiError(
      body?.message ?? error.message ?? 'Request failed',
      body?.code ?? 'UNKNOWN_ERROR',
      error.response?.status ?? 0,
      body?.details,
    );
  },
);

/** Unwraps the API's { success, data } envelope so callers just get T. */
export async function apiGet<T>(url: string): Promise<T> {
  const res = await httpClient.get<ApiEnvelope<T>>(url);
  return res.data.data;
}
export async function apiPost<T>(url: string, body?: unknown): Promise<T> {
  const res = await httpClient.post<ApiEnvelope<T>>(url, body);
  return res.data.data;
}
export async function apiPatch<T>(url: string, body?: unknown): Promise<T> {
  const res = await httpClient.patch<ApiEnvelope<T>>(url, body);
  return res.data.data;
}
export async function apiDelete<T>(url: string): Promise<T> {
  const res = await httpClient.delete<ApiEnvelope<T>>(url);
  return res.data.data;
}
