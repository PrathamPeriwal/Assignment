import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { controlStyles } from './control-styles';

export function Select({ className, children, ...props }: ComponentProps<'select'>) {
  return (
    <span className="relative block">
      <select className={cn(controlStyles, 'appearance-none pr-10', className)} {...props}>
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 12 8"
        className="pointer-events-none absolute top-1/2 right-3 h-2 w-3 -translate-y-1/2"
      >
        <path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    </span>
  );
}
