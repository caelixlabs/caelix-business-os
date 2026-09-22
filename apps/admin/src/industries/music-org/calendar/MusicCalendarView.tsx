'use client';

import { useCallback } from 'react';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useMusicBatches } from '@/features/music/batches/api/use-batches';
import { useMusicCourses } from '@/features/music/courses/api/use-courses';
import { PageHeader } from '@/components/ui/page-header';
import { Calendar } from '@/components/data/calendar/Calendar';
import { expandWeeklySchedules } from '@/lib/schedule';

export function MusicCalendarView() {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;
  const { data: batches } = useMusicBatches(organizationId);
  const { data: courses } = useMusicCourses(organizationId);

  const getEvents = useCallback(
    (from: Date, to: Date) =>
      expandWeeklySchedules(batches ?? [], from, to).map(({ source, ...occurrence }) => ({
        ...occurrence,
        meta: courses?.find((course) => course.id === source.courseId)?.name,
      })),
    [batches, courses],
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Calendar" description="Every batch on your schedule — switch between day, week and month." />
      <Calendar getEvents={getEvents} />
    </div>
  );
}
