import { cn } from '@/lib/utils';

export function Skeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-text/5',
        className,
      )}
    />
  );
}
