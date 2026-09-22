'use client';

import { format, isSameDay } from 'date-fns';

import { cn } from '@/lib/utils';

import { layoutDayEvents, minutesFromDayStart } from './layout';
import type { CalendarEventItem } from './types';

const HOUR_PX = 56;

interface TimeGridProps {
  days: Date[];
  events: CalendarEventItem[];
  startHour: number;
  endHour: number;
  onDayClick: (day: Date) => void;
}

export function TimeGrid({ days, events, startHour, endHour, onDayClick }: TimeGridProps) {
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  const gridHeight = hours.length * HOUR_PX;
  const now = new Date();
  const columns = `56px repeat(${days.length}, minmax(0, 1fr))`;

  return (
    <div className="overflow-x-auto">
      <div style={{ minWidth: days.length > 1 ? 720 : 360 }}>
        <div className="grid border-b border-border" style={{ gridTemplateColumns: columns }}>
          <div />
          {days.map((day) => {
            const today = isSameDay(day, now);
            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => onDayClick(day)}
                className="flex flex-col items-center gap-0.5 border-l border-border/70 py-2 text-xs text-text-secondary hover:bg-canvas"
              >
                <span className="uppercase tracking-wide">{format(day, 'EEE')}</span>
                <span
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold text-text',
                    today && 'bg-accent text-white',
                  )}
                >
                  {format(day, 'd')}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid" style={{ gridTemplateColumns: columns }}>
          <div>
            {hours.map((hour) => (
              <div key={hour} style={{ height: HOUR_PX }} className="pr-2 text-right text-[11px] text-text-secondary">
                <span className="relative -top-2">{format(new Date(2000, 0, 1, hour), 'h a')}</span>
              </div>
            ))}
          </div>

          {days.map((day) => {
            const dayEvents = events.filter((event) => isSameDay(event.start, day));
            const nowOffset = ((minutesFromDayStart(now) - startHour * 60) / 60) * HOUR_PX;

            return (
              <div
                key={day.toISOString()}
                className="relative border-l border-border/70"
                style={{
                  height: gridHeight,
                  backgroundImage: 'linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
                  backgroundSize: `100% ${HOUR_PX}px`,
                }}
              >
                {layoutDayEvents(dayEvents).map(({ event, lane, lanes }) => {
                  const top = ((minutesFromDayStart(event.start) - startHour * 60) / 60) * HOUR_PX;
                  const end = event.end ?? event.start;
                  const height = Math.max(24, ((end.getTime() - event.start.getTime()) / 3_600_000) * HOUR_PX);
                  if (top + height <= 0 || top >= gridHeight) return null;

                  return (
                    <div
                      key={event.id}
                      title={`${event.title} · ${format(event.start, 'p')}–${format(end, 'p')}`}
                      className="absolute overflow-hidden rounded-md border border-accent/25 bg-accent-soft px-1.5 py-1 text-[11px] leading-tight text-accent-ink"
                      style={{
                        top: Math.max(0, top),
                        height,
                        left: `calc(${(lane / lanes) * 100}% + 2px)`,
                        width: `calc(${100 / lanes}% - 4px)`,
                      }}
                    >
                      <p className="truncate font-semibold">{event.title}</p>
                      <p className="truncate opacity-75">
                        {format(event.start, 'p')}
                        {event.meta ? ` · ${event.meta}` : ''}
                      </p>
                    </div>
                  );
                })}

                {isSameDay(day, now) && nowOffset >= 0 && nowOffset <= gridHeight && (
                  <div className="pointer-events-none absolute inset-x-0 z-10 h-px bg-danger" style={{ top: nowOffset }}>
                    <span className="absolute -left-1 -top-[3px] h-[7px] w-[7px] rounded-full bg-danger" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
