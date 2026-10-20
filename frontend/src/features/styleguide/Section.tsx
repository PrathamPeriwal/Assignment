import type { ReactNode } from 'react';
import { SectionLabel } from '@/components/ui/SectionLabel';

interface SectionProps {
  no: number;
  title: string;
  children: ReactNode;
}

export function Section({ no, title, children }: SectionProps) {
  return (
    <section className="mt-14">
      <SectionLabel no={no}>{title}</SectionLabel>
      <div className="mt-6">{children}</div>
    </section>
  );
}
