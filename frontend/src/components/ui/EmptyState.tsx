import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
}

export function EmptyState({ title, children, actions }: EmptyStateProps) {
  return (
    <div className="rule flex flex-col items-start gap-3 rounded-sm border-dashed bg-paper-2/50 px-5 py-8 sm:px-8 sm:py-10">
      <h2 className="font-display text-h2 text-balance">{title}</h2>
      {children && <div className="max-w-md text-ink-soft">{children}</div>}
      {actions && <div className="mt-2 flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}
