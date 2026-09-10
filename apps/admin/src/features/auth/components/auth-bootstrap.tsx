'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { authApi } from '../api/auth.api';

/**
 * Mounted once at the app root. Reads the persisted refresh token (if
 * any) and exchanges it for a fresh session, so a page reload doesn't
 * force a re-login. Renders nothing — it's pure side effect.
 */
export function AuthBootstrap() {
  const applySession = useAuthStore((s) => s.applySession);
  const clearSession = useAuthStore((s) => s.clearSession);
  const hydrateRefreshToken = useAuthStore((s) => s.hydrateRefreshToken);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const stored = hydrateRefreshToken();
    if (!stored) {
      clearSession();
      return;
    }

    authApi
      .refresh(stored)
      .then(applySession)
      .catch(() => clearSession());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
