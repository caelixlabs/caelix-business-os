import type { ReactNode } from 'react';
import Image from 'next/image';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-surface">
      <aside className="relative hidden w-[42%] shrink-0 flex-col justify-between overflow-hidden bg-ink p-10 lg:flex">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '18px 18px',
          }}
        />

        <div className="relative flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
            <Image src="/brand/logo-mark.png" alt="Caelix" width={22} height={22} className="rounded-md" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white">Caelix</span>
        </div>

        <div className="relative max-w-sm">
          <h2 className="text-2xl font-semibold leading-tight text-white text-balance">
            The operating system for your business, whatever it runs on.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-on-ink">
            One login. Your industry, your terms, your workflow — configured automatically.
          </p>
        </div>

        <p className="relative text-xs text-muted-on-ink">© {new Date().getFullYear()} Caelix Business OS</p>
      </aside>

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-ink ring-1 ring-black/5">
              <Image src="/brand/logo-mark.png" alt="Caelix" width={22} height={22} className="rounded-md" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-text">Caelix</span>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
