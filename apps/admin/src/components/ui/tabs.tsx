'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export const Tabs = TabsPrimitive.Root;

export function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <TabsPrimitive.List
      className={cn('inline-flex items-center gap-1 rounded-lg bg-canvas p-1', className)}
    >
      {children}
    </TabsPrimitive.List>
  );
}

export function TabsTrigger({
  children,
  value,
}: {
  children: ReactNode;
  value: string;
}) {
  return (
    <TabsPrimitive.Trigger
      value={value}
      className="rounded-md px-3 py-1.5 text-xs font-medium text-text-secondary outline-none transition-colors data-[state=active]:bg-surface data-[state=active]:text-text data-[state=active]:shadow-sm"
    >
      {children}
    </TabsPrimitive.Trigger>
  );
}

export function TabsContent({ children, value }: { children: ReactNode; value: string }) {
  return (
    <TabsPrimitive.Content value={value} className="mt-4 outline-none">
      {children}
    </TabsPrimitive.Content>
  );
}
