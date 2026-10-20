import { Skeleton } from '@/components/ui/Skeleton';
import { TicketSkeleton } from '@/components/ui/TicketSkeleton';

const sections = [2, 1];

export function MySessionsSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading your sessions"
      className="flex flex-col gap-14"
    >
      {sections.map((count, section) => (
        <div key={section}>
          <div className="rule-b pb-3">
            <Skeleton className="h-10 w-44" />
          </div>
          <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(min(100%,19rem),1fr))] gap-x-6 gap-y-8">
            {Array.from({ length: count }, (_, index) => (
              <TicketSkeleton key={index} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
