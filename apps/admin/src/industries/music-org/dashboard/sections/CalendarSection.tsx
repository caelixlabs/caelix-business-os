import Link from 'next/link';
import { ArrowRight, CalendarDays } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { PATHS } from '@/routes/paths';

export function CalendarSection() {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-text">Calendar</h2>
          <p className="mt-0.5 text-xs text-text-secondary">
            Role-aware classes, lessons and attendance schedule.
          </p>
        </div>
        <Link
          href={PATHS.music.calendar}
          className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-ink"
        >
          Open calendar <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <Link href={PATHS.music.calendar} className="block">
        <Card className="group overflow-hidden transition hover:border-accent/30 hover:shadow-md">
          <div className="grid min-h-[280px] place-items-center p-6 text-center">
            <div className="max-w-lg">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-ink">
                <CalendarDays className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-text">Today&apos;s schedule</h3>
              <p className="mt-1 text-xs leading-5 text-text-secondary">
                Owners and front desk can see the organization schedule. Teachers see assigned students and classes. Students see only their own schedule.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-accent">
                View calendar <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </section>
  );
}
