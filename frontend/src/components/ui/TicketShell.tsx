import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface TicketShellProps {
  surface: string;
  main: ReactNode;
  stub: ReactNode;
}

export function TicketShell({ surface, main, stub }: TicketShellProps) {
  return (
    <span className="notched-outer block rounded-sm bg-ink p-[1.5px]">
      <span className={cn('notched-inner flex flex-col', surface)}>
        <span className="flex-1 px-4 pt-4 pb-5">{main}</span>
        <span className="rule-t flex h-(--tear) items-center justify-between gap-3 border-dashed px-4">
          {stub}
        </span>
      </span>
    </span>
  );
}
