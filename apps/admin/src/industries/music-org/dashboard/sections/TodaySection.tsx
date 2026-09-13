'use client';

import { useMemo } from 'react';
import { BookOpen, GraduationCap, Users } from 'lucide-react';

import { useOrganizationContext } from '@/contexts/organization/OrganizationContext';
import { useMusicBatches } from '@/features/music/batches/api/use-batches';
import { useMusicEnrollments } from '@/features/music/enrollments/api/use-enrollments';
import { StatCard } from '@/components/data/stat-card';
import { PATHS } from '@/routes/paths';

const WEEKDAY_BY_INDEX = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export function TodaySection() {
  const { organization } = useOrganizationContext();
  const organizationId = organization?.id;
  const { data: batches } = useMusicBatches(organizationId);
  const { data: enrollments } = useMusicEnrollments(organizationId);

  const todaysBatches = useMemo(() => {
    if (!batches) return [];
    const today = new Date();
    const weekday = WEEKDAY_BY_INDEX[today.getDay()];
    const isoDate = today.toISOString().slice(0, 10);

    return batches.filter((batch) => {
      if (!batch.days.includes(weekday)) return false;
      if (isoDate < batch.startDate.slice(0, 10)) return false;
      if (batch.endDate && isoDate > batch.endDate.slice(0, 10)) return false;
      return true;
    });
  }, [batches]);

  const teacherCount = new Set(todaysBatches.map((batch) => batch.teacherUserId).filter(Boolean)).size;

  const studentCount = useMemo(() => {
    if (!enrollments) return 0;
    const batchIds = new Set(todaysBatches.map((batch) => batch.id));
    return new Set(
      enrollments.filter((e) => e.status === 'ACTIVE' && batchIds.has(e.batchId)).map((e) => e.studentId),
    ).size;
  }, [enrollments, todaysBatches]);

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-text">Today&apos;s operations</h2>
        <p className="mt-0.5 text-xs text-text-secondary">
          The metrics that matter most for today&apos;s academy activity.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          href={PATHS.music.students}
          title="Students"
          value={batches ? studentCount : '—'}
          description="scheduled for today's classes"
          icon={GraduationCap}
        />
        <StatCard
          href={PATHS.music.teachers}
          title="Teachers"
          value={batches ? teacherCount : '—'}
          description="scheduled for today"
          icon={Users}
        />
        <StatCard
          href={PATHS.music.calendar}
          title="Classes"
          value={batches ? todaysBatches.length : '—'}
          description="scheduled for today"
          icon={BookOpen}
        />
      </div>
    </section>
  );
}
