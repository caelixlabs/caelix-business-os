'use client';

import { CalendarDays } from 'lucide-react';

import { PageHeader } from '@/components/ui/page-header';
import { TodaySection } from './sections/TodaySection';
import { CalendarSection } from './sections/CalendarSection';
import { SubscriptionSection } from './sections/SubscriptionSection';
import { EnquirySection } from './sections/EnquirySection';

export function MusicOrgDashboard() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Music workspace"
        description="Run today's academy operations from one focused workspace."
        action={
          <a href="/dashboard/music/calendar" className="inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-white shadow-sm transition hover:bg-accent-ink">
            <CalendarDays className="h-4 w-4" />
            Open calendar
          </a>
        }
      />

      <TodaySection />
      <CalendarSection />
      <SubscriptionSection />
      <EnquirySection />
    </div>
  );
}
