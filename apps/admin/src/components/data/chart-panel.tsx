'use client';

import type { ReactNode } from 'react';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ChartPanel({
  title,
  description,
  children,
  loading = false,
  empty = false,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  loading?: boolean;
  empty?: boolean;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-border/80 px-5 py-4">
        <h3 className="text-sm font-semibold text-text">
          {title}
        </h3>
        {description && (
          <p className="mt-0.5 text-xs text-text-secondary">
            {description}
          </p>
        )}
      </div>

      <div className="p-5">
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : empty ? (
          <div className="grid min-h-64 place-items-center text-sm text-text-secondary">
            No data available for this period.
          </div>
        ) : (
          children
        )}
      </div>
    </Card>
  );
}
