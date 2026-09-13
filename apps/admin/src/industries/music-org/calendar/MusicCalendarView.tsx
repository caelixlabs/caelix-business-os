'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useMusicBatches } from '@/features/music/batches/api/use-batches';
import { useMusicCourses } from '@/features/music/courses/api/use-courses';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { CalendarGrid, type CalendarEventItem } from '@/components/data/calendar-grid';

const WEEKDAY_BY_INDEX = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function toISODate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function withTime(date: Date, time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

export function MusicCalendarView() {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;
  const { data: batches } = useMusicBatches(organizationId);
  const { data: courses } = useMusicCourses(organizationId);
  const [date, setDate] = useState(new Date());

  const weekday = WEEKDAY_BY_INDEX[date.getDay()];
  const isoDate = toISODate(date);

  const events: CalendarEventItem[] = useMemo(() => {
    if (!batches) return [];

    return batches
      .filter((batch) => {
        if (!batch.days.includes(weekday)) return false;
        if (isoDate < batch.startDate.slice(0, 10)) return false;
        if (batch.endDate && isoDate > batch.endDate.slice(0, 10)) return false;
        return true;
      })
      .map((batch) => ({
        id: batch.id,
        title: batch.name,
        start: withTime(date, batch.startTime),
        end: withTime(date, batch.endTime),
        meta: courses?.find((course) => course.id === batch.courseId)?.name,
      }));
  }, [batches, courses, weekday, isoDate, date]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description="Role-aware classes, lessons and attendance schedule."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              className="!h-9 !w-9 !px-0"
              onClick={() => setDate((current) => new Date(current.getTime() - 86400000))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="secondary" onClick={() => setDate(new Date())}>
              Today
            </Button>
            <Button
              variant="secondary"
              className="!h-9 !w-9 !px-0"
              onClick={() => setDate((current) => new Date(current.getTime() + 86400000))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      <div className="flex items-center gap-2 rounded-xl border border-accent/20 bg-accent-soft px-4 py-3 text-xs text-accent-ink">
        <CalendarDays className="h-4 w-4 shrink-0" />
        <span>
          Showing every batch scheduled on this day. Class-level views for teachers and students are next on the roadmap.
        </span>
      </div>

      <CalendarGrid date={date} events={events} />
    </div>
  );
}
