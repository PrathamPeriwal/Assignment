import { Skeleton } from './Skeleton';
import { TicketShell } from './TicketShell';

export function TicketSkeleton() {
  return (
    <div aria-hidden="true" className="drop-shadow-hard">
      <TicketShell
        surface="bg-paper-2"
        main={
          <>
            <span className="flex items-baseline justify-between gap-3">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-16" />
            </span>
            <Skeleton className="mt-4 h-7 w-3/4" />
            <Skeleton className="mt-3 h-3 w-1/2" />
          </>
        }
        stub={
          <>
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-12" />
          </>
        }
      />
    </div>
  );
}
