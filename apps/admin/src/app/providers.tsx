'use client';

import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { QueryProvider } from '@/providers/query-provider';
import { AuthBootstrap } from '@/contexts/auth/AuthBootstrap';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthBootstrap />
      {children}
      <Toaster position="top-right" richColors closeButton />
    </QueryProvider>
  );
}
