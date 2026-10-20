import type { ReactNode } from 'react';
import { SectionLabel } from '../ui/SectionLabel';

interface PageHeaderProps {
  no: number;
  label: string;
  title: ReactNode;
  intro?: string;
  action?: ReactNode;
}

export function PageHeader({ no, label, title, intro, action }: PageHeaderProps) {
  return (
    <header>
      <SectionLabel no={no}>{label}</SectionLabel>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <div className="max-w-3xl">
          <h1 className="font-display text-h1 text-balance">{title}</h1>
          {intro && <p className="mt-4 max-w-xl text-lead text-ink-soft">{intro}</p>}
        </div>
        {action}
      </div>
    </header>
  );
}
