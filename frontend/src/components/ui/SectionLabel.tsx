import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface SectionLabelProps {
  no: number;
  children?: ReactNode;
  className?: string;
}

export function SectionLabel({ no, children, className }: SectionLabelProps) {
  return (
    <p className={cn('mono-label flex items-center gap-3 text-ink-soft', className)}>
      <span className="text-ink">No. {String(no).padStart(2, '0')}</span>
      {children && <span>{children}</span>}
      <span aria-hidden="true" className="h-[1.5px] flex-1 bg-ink" />
    </p>
  );
}
