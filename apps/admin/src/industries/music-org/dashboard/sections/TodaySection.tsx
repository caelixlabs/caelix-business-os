'use client';

import { BookOpen, GraduationCap, Users } from 'lucide-react';

import { StatCard } from '@/components/data/stat-card';
import { PATHS } from '@/routes/paths';

export function TodaySection() {
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
          value="—"
          description="scheduled for today&apos;s classes"
          icon={GraduationCap}
        />
        <StatCard
          href={PATHS.music.teachers}
          title="Teachers"
          value="—"
          description="scheduled for today"
          icon={Users}
        />
        <StatCard
          href={PATHS.music.calendar}
          title="Classes"
          value="—"
          description="scheduled for today"
          icon={BookOpen}
        />
      </div>
    </section>
  );
}
