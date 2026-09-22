'use client';

import { format, isSameDay, isSameMonth } from 'date-fns';

import { cn } from '@/lib/utils';

import type { CalendarEventItem } from './types';

const MAX_VISIBLE = 3;

interface MonthGridProps {
  days: Date[];
  month: Date;
  events: CalendarEventItem[];
  onDayClick: (day: Date) => void;
}

export function MonthGrid({ days, month, events, onDayClick }: MonthGridProps) {
  const now = new Date();

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[640px]">
        <div className="grid grid-cols-7 border-b border-border">
          {days.slice(0, 7).map((day) => (
            <div key={day.toISOString()} className="px-2 py-2 text-xs uppercase tracking-wide text-text-secondary">
              {format(day, 'EEE')}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((day) => {
            const dayEvents = events
              .filter((event) => isSameDay(event.start, day))
              .sort((a, b) => a.start.getTime() - b.start.getTime());

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  'min-h-28 border-b border-l border-border/70 p-1.5 first:border-l-0 [&:nth-child(7n+1)]:border-l-0',
                  !isSameMonth(day, month) && 'bg-canvas/60',
                )}
              >
                <button
                  type="button"
                  onClick={() => onDayClick(day)}
                  className={cn(
                    'mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs hover:bg-canvas',
                    isSameMonth(day, month) ? 'text-text' : 'text-text-secondary/60',
                    isSameDay(day, now) && 'bg-accent font-semibold text-white hover:bg-accent',
                  )}
                >
                  {format(day, 'd')}
                </button>

                <div className="flex flex-col gap-1">
                  {dayEvents.slice(0, MAX_VISIBLE).map((event) => (
                    <div
                      key={event.id}
                      title={`${event.title} · ${format(event.start, 'p')}`}
                      className="truncate rounded bg-accent-soft px-1.5 py-0.5 text-[11px] text-accent-ink"
                    >
                      <span className="font-medium">{format(event.start, 'h:mma').toLowerCase()}</span> {event.title}
                    </div>
                  ))}
                  {dayEvents.length > MAX_VISIBLE && (
                    <button
                      type="button"
                      onClick={() => onDayClick(day)}
                      className="px-1.5 text-left text-[11px] font-medium text-text-secondary hover:text-text"
                    >
                      +{dayEvents.length - MAX_VISIBLE} more
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
