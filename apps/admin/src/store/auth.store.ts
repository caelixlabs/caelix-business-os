import { create } from 'zustand';
import type { AppUser, AuthResponse } from '@/features/auth/types';

const REFRESH_TOKEN_KEY = 'caelix_auth';
/** Non-httpOnly flag cookie, read only by proxy.ts for proxy route-gate
 * redirects. Carries no secret — the real tokens never touch a cookie. */
const SESSION_FLAG_COOKIE = 'caelix_session';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  user: AppUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: AuthStatus;
  roles: string[];
  permissions: string[];
  applySession: (session: AuthResponse) => void;
  clearSession: () => void;
  hydrateRefreshToken: () => string | null;
}

function setSessionCookie(present: boolean) {
  if (typeof document === 'undefined') return;
  document.cookie = present
    ? `${SESSION_FLAG_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`
    : `${SESSION_FLAG_COOKIE}=; path=/; max-age=0`;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  status: 'loading',
  roles: [],
  permissions: [],

  applySession: (session) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
    }
    setSessionCookie(true);
    set({
      user: session.user,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      status: 'authenticated',
      roles: session.roles,
      permissions: session.permissions,
    });
  },

  clearSession: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
    setSessionCookie(false);
    set({ 
      user: null, 
      accessToken: null, 
      refreshToken: null, 
      status: 'unauthenticated', 
      roles: [], 
      permissions: [], 
    });
  },

  hydrateRefreshToken: () => {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  },
}));
