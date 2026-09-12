import Link from 'next/link';
import { AlertCircle, ArrowRight } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { PATHS } from '@/routes/paths';

export function EnquirySection() {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold text-text">Enquiries</h2>
        <p className="mt-0.5 text-xs text-text-secondary">
          New and active leads that need attention.
        </p>
      </div>

      <Link href={PATHS.music.enquiries} className="block">
        <Card className="group p-5 transition hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-ink">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-text">New enquiries</p>
              <p className="mt-1 text-xs text-text-secondary">
                Open the enquiry pipeline and follow up with leads.
              </p>
            </div>
            <span className="text-2xl font-semibold text-text">—</span>
            <ArrowRight className="h-4 w-4 text-text-secondary transition-transform group-hover:translate-x-0.5" />
          </div>
        </Card>
      </Link>
    </section>
  );
}
