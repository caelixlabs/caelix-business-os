'use client';

import { useMemo, useState } from 'react';
import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUIStore, type CalendarViewMode } from '@/store/ui.store';

import { MonthGrid } from './MonthGrid';
import { TimeGrid } from './TimeGrid';
import type { CalendarEventItem } from './types';

export type { CalendarEventItem };

interface CalendarProps {
  /** Must be referentially stable (useCallback) — called whenever the visible range changes. */
  getEvents: (from: Date, to: Date) => CalendarEventItem[];
}

const HOUR_OPTIONS = Array.from({ length: 25 }, (_, hour) => hour);

function hourLabel(hour: number) {
  return format(new Date(2000, 0, 1, hour % 24), 'h a');
}

export function Calendar({ getEvents }: CalendarProps) {
  const prefs = useUIStore((state) => state.calendarPrefs);
  const setPrefs = useUIStore((state) => state.setCalendarPrefs);
  const [date, setDate] = useState(() => new Date());

  const { view, weekStartsOn, dayStartHour, dayEndHour } = prefs;
  const weekOptions = { weekStartsOn };

  const days = useMemo(() => {
    if (view === 'day') return [date];
    if (view === 'week') {
      return eachDayOfInterval({ start: startOfWeek(date, weekOptions), end: endOfWeek(date, weekOptions) });
    }
    return eachDayOfInterval({
      start: startOfWeek(startOfMonth(date), weekOptions),
      end: endOfWeek(endOfMonth(date), weekOptions),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, date, weekStartsOn]);

  const events = useMemo(() => getEvents(days[0], addDays(days[days.length - 1], 1)), [getEvents, days]);

  function step(direction: 1 | -1) {
    setDate((current) =>
      view === 'day' ? addDays(current, direction) : view === 'week' ? addWeeks(current, direction) : addMonths(current, direction),
    );
  }

  function openDay(day: Date) {
    setDate(day);
    setPrefs({ view: 'day' });
  }

  const title =
    view === 'day'
      ? format(date, 'EEEE, d MMMM yyyy')
      : view === 'week'
        ? `${format(days[0], 'd MMM')} – ${format(days[6], 'd MMM yyyy')}`
        : format(date, 'MMMM yyyy');

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="!h-9 !w-9 !px-0" aria-label="Previous" onClick={() => step(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="secondary" className="!h-9" onClick={() => setDate(new Date())}>
            Today
          </Button>
          <Button variant="secondary" className="!h-9 !w-9 !px-0" aria-label="Next" onClick={() => step(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h2 className="ml-2 text-sm font-semibold text-text">{title}</h2>
        </div>

        <div className="flex items-center gap-2">
          <Tabs value={view} onValueChange={(value) => setPrefs({ view: value as CalendarViewMode })}>
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary" className="!h-9 !w-9 !px-0" aria-label="Customise calendar">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 space-y-3">
              <p className="text-xs font-semibold text-text">Customise calendar</p>

              <label className="flex flex-col gap-1.5 text-xs text-text-secondary">
                Week starts on
                <Select value={String(weekStartsOn)} onValueChange={(value) => setPrefs({ weekStartsOn: Number(value) as 0 | 1 })}>
                  <SelectTrigger>{weekStartsOn === 1 ? 'Monday' : 'Sunday'}</SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Monday</SelectItem>
                    <SelectItem value="0">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </label>

              <label className="flex flex-col gap-1.5 text-xs text-text-secondary">
                Day starts at
                <Select value={String(dayStartHour)} onValueChange={(value) => setPrefs({ dayStartHour: Number(value) })}>
                  <SelectTrigger>{hourLabel(dayStartHour)}</SelectTrigger>
                  <SelectContent>
                    {HOUR_OPTIONS.filter((hour) => hour < dayEndHour).map((hour) => (
                      <SelectItem key={hour} value={String(hour)}>
                        {hourLabel(hour)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>

              <label className="flex flex-col gap-1.5 text-xs text-text-secondary">
                Day ends at
                <Select value={String(dayEndHour)} onValueChange={(value) => setPrefs({ dayEndHour: Number(value) })}>
                  <SelectTrigger>{dayEndHour === 24 ? '12 AM (midnight)' : hourLabel(dayEndHour)}</SelectTrigger>
                  <SelectContent>
                    {HOUR_OPTIONS.filter((hour) => hour > dayStartHour).map((hour) => (
                      <SelectItem key={hour} value={String(hour)}>
                        {hour === 24 ? '12 AM (midnight)' : hourLabel(hour)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {view === 'month' ? (
        <MonthGrid days={days} month={date} events={events} onDayClick={openDay} />
      ) : (
        <TimeGrid days={days} events={events} startHour={dayStartHour} endHour={dayEndHour} onDayClick={openDay} />
      )}
    </div>
  );
}
