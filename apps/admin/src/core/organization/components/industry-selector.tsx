'use client';

import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { INDUSTRIES } from '@/core/industry/industry.registry';
import type { IndustryType } from '@/core/industry/industry.types';

interface IndustrySelectorProps {
  value?: IndustryType;
  onChange: (value: IndustryType | undefined) => void;
}

export function IndustrySelector({ value, onChange }: IndustrySelectorProps) {
  const selected = INDUSTRIES.find((industry) => industry.value === value);
  const [input, setInput] = useState(selected?.label ?? '');
  const [open, setOpen] = useState(false);

  // Re-sync the free-text input when `value` changes from outside (e.g. a
  // form reset) — adjusted during render per React's guidance, rather than
  // via an effect, so there isn't an extra render between the two updates.
  const [syncedLabel, setSyncedLabel] = useState(selected?.label);
  if (selected?.label !== syncedLabel) {
    setSyncedLabel(selected?.label);
    setInput(selected?.label ?? '');
  }

  const suggestions = useMemo(() => {
    const keyword = input.trim().toLowerCase();

    if (!keyword) return INDUSTRIES;

    return INDUSTRIES.filter(
      (industry) =>
        industry.label.toLowerCase().includes(keyword) ||
        industry.value.toLowerCase().includes(keyword),
    );
  }, [input]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          id="industry"
          value={input}
          autoComplete="off"
          placeholder="Type an industry..."
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setInput(event.target.value);
            setOpen(true);

            const matches = INDUSTRIES.some(
              (industry) =>
                industry.label.toLowerCase() ===
                event.target.value.trim().toLowerCase(),
            );

            if (!matches) onChange(undefined);
          }}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className="w-full rounded-md border border-border bg-surface px-3 py-2 pr-9 text-sm text-text outline-none transition focus:border-accent disabled:opacity-50"
        />

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
          {suggestions.map((industry) => (
            <button
              key={industry.value}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setInput(industry.label);
                onChange(industry.value);
                setOpen(false);
              }}
              className="flex w-full cursor-pointer items-center px-3 py-2.5 text-left text-sm text-text transition-colors hover:bg-canvas"
            >
              {industry.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
