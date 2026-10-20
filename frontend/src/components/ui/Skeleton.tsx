import { cn } from '@/lib/cn';

export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('block animate-ink-pulse rounded-sm bg-ink/10', className)}
    />
  );
}
