'use client';

import { useMemo } from 'react';

export interface CalendarEventItem {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  meta?: string;
}

export function CalendarGrid({
  date = new Date(),
  events = [],
}: {
  date?: Date;
  events?: CalendarEventItem[];
}) {
  const hours = useMemo(
    () => Array.from({ length: 12 }, (_, index) => index + 8),
    [],
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-4 text-sm font-semibold text-text">
        {new Intl.DateTimeFormat('en-IN', {
          dateStyle: 'full',
        }).format(date)}
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          {hours.map((hour) => {
            const hourEvents = events.filter(
              (event) => event.start.getHours() === hour,
            );

            return (
              <div
                key={hour}
                className="grid min-h-20 grid-cols-[72px_1fr] border-b border-border/70 last:border-b-0"
              >
                <div className="border-r border-border/70 px-3 py-3 text-right text-[11px] text-text-secondary">
                  {hour}:00
                </div>

                <div className="relative p-2">
                  {hourEvents.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-lg border border-accent/20 bg-accent-soft px-3 py-2 text-xs text-accent-ink"
                    >
                      <p className="font-semibold">{event.title}</p>
                      {event.meta && <p className="mt-0.5 opacity-75">{event.meta}</p>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
