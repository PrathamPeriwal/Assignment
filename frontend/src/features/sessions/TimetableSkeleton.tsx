import { Skeleton } from '@/components/ui/Skeleton';
import { TicketSkeleton } from '@/components/ui/TicketSkeleton';
import { slotGrid, slotRow } from './timetable-styles';

const rows = [2, 1, 3];

export function TimetableSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading open slots" className="rule-t">
      {rows.map((count, row) => (
        <div key={row} className={slotRow}>
          <Skeleton className="h-7 w-16" />
          <div className={slotGrid}>
            {Array.from({ length: count }, (_, index) => (
              <TicketSkeleton key={index} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
