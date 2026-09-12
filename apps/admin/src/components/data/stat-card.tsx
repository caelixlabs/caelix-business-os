'use client';

import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUp, Minus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Card } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  period?: string;
  trend?: 'up' | 'down' | 'neutral';
  href?: string;
  icon?: LucideIcon;
  description?: string;
}

export function StatCard({
  title,
  value,
  change,
  period,
  trend = 'neutral',
  href,
  icon: Icon,
  description,
}: StatCardProps) {
  const content = (
    <Card className="group h-full p-5 transition-all hover:border-accent/30 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent-ink">
            <Icon className="h-5 w-5" />
          </div>
        )}

        {href && (
          <ArrowRight className="h-4 w-4 text-text-secondary opacity-0 transition-opacity group-hover:opacity-100" />
        )}
      </div>

      <p className="mt-5 text-xs font-medium text-text-secondary">
        {title}
      </p>

      <div className="mt-1 flex items-end gap-2">
        <p className="text-3xl font-semibold tracking-tight text-text">
          {value}
        </p>

        {change !== undefined && (
          <span
            className={`mb-1 inline-flex items-center gap-0.5 text-xs font-medium ${
              trend === 'up'
                ? 'text-success'
                : trend === 'down'
                  ? 'text-danger'
                  : 'text-text-secondary'
            }`}
          >
            {trend === 'up' && <ArrowUp className="h-3 w-3" />}
            {trend === 'down' && <ArrowDown className="h-3 w-3" />}
            {trend === 'neutral' && <Minus className="h-3 w-3" />}
            {Math.abs(change)}%
          </span>
        )}
      </div>

      <p className="mt-1 text-[11px] text-text-secondary">
        {description ?? period ?? 'Current'}
      </p>
    </Card>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
