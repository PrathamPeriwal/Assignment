import { Skeleton } from '@/components/ui/Skeleton';

export function TeacherSkeleton() {
  return (
    <div aria-hidden="true" className="rule rounded-sm bg-paper px-4 pt-3 pb-4 shadow-hard-sm">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-10" />
      </div>
      <div className="mt-2 h-0.5 bg-ink/10" />
      <div className="mt-4 flex items-end justify-between gap-8">
        <div className="flex-1">
          <Skeleton className="h-7 w-48 max-w-full" />
          <Skeleton className="mt-2 h-4 w-32" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
    </div>
  );
}
