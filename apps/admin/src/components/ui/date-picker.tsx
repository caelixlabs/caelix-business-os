'use client';

import { CalendarDays } from 'lucide-react';

export function DatePicker({
  value,
  onChange,
  min,
  max,
}: {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
}) {
  return (
    <label className="relative block">
      <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
      <input
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-text outline-none focus:border-accent"
      />
    </label>
  );
}
