'use client';

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export function DropdownMenuContent({
  children,
  className,
  align = 'end',
}: {
  children: ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
}) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        align={align}
        sideOffset={8}
        className={cn(
          'z-50 min-w-48 rounded-xl border border-border bg-surface p-1.5 shadow-xl',
          className,
        )}
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );
}

export function DropdownMenuItem({
  children,
  onSelect,
  destructive = false,
}: {
  children: ReactNode;
  onSelect?: () => void;
  destructive?: boolean;
}) {
  return (
    <DropdownMenuPrimitive.Item
      onSelect={onSelect}
      className={cn(
        'flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors',
        destructive
          ? 'text-danger focus:bg-danger-soft'
          : 'text-text focus:bg-canvas',
      )}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  );
}

export function DropdownMenuLabel({ children }: { children: ReactNode }) {
  return (
    <DropdownMenuPrimitive.Label className="px-3 py-2 text-xs text-text-secondary">
      {children}
    </DropdownMenuPrimitive.Label>
  );
}

export function DropdownMenuSeparator() {
  return (
    <DropdownMenuPrimitive.Separator className="my-1 h-px bg-border" />
  );
}
