import { cn } from '@/lib/utils';

export function Avatar({
  initials,
  className,
}: {
  initials: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent-ink',
        className,
      )}
    >
      {initials}
    </div>
  );
}
