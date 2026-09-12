'use client';

import { useEffect, useRef } from 'react';

import { useAuthStore } from '@/store/auth.store';
import { authApi } from '@/features/auth/api/auth.api';

export function AuthBootstrap() {
  const applySession = useAuthStore((state) => state.applySession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const hydrateRefreshToken = useAuthStore((state) => state.hydrateRefreshToken);
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
  }, [applySession, clearSession, hydrateRefreshToken]);

  return null;
}
