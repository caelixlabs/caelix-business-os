'use client';

import { CalendarDays } from 'lucide-react';

import { PageHeader } from '@/components/ui/page-header';
import { CalendarGrid } from '@/components/data/calendar-grid';

export function MusicCalendarView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description="Role-aware classes, lessons and attendance schedule."
      />

      <div className="flex items-center gap-2 rounded-xl border border-accent/20 bg-accent-soft px-4 py-3 text-xs text-accent-ink">
        <CalendarDays className="h-4 w-4 shrink-0" />
        <span>
          The visible schedule is determined by the current user&apos;s organization, role and permissions.
        </span>
      </div>

      <CalendarGrid />
    </div>
  );
}
