import type { ReactNode } from 'react';
import { SectionLabel } from '../ui/SectionLabel';

interface PagePlaceholderProps {
  no: number;
  label: string;
  title: ReactNode;
  children: ReactNode;
}

export function PagePlaceholder({ no, label, title, children }: PagePlaceholderProps) {
  return (
    <section className="max-w-3xl">
      <SectionLabel no={no}>{label}</SectionLabel>
      <h1 className="font-display mt-6 text-h1">{title}</h1>
      <div className="mt-6 max-w-xl text-lead text-ink-soft">{children}</div>
    </section>
  );
}
