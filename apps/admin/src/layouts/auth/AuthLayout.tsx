import type { ReactNode } from 'react';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas px-4 py-8">
      <main className="w-full max-w-md">{children}</main>
    </div>
  );
}
