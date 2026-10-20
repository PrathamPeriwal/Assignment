import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-sm font-semibold whitespace-nowrap select-none ' +
  'transition-[translate,box-shadow,background-color,border-color] duration-300 ease-spring ' +
  'aria-disabled:pointer-events-none aria-disabled:opacity-50 disabled:pointer-events-none disabled:opacity-50';

const raised =
  'rule shadow-hard hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg ' +
  'active:translate-x-1 active:translate-y-1 active:shadow-press';

const variants: Record<ButtonVariant, string> = {
  primary: `${raised} bg-vermilion text-ink`,
  secondary: `${raised} bg-paper text-ink`,
  ghost:
    'rule border-transparent bg-transparent text-ink hover:border-ink hover:bg-paper-2 active:bg-paper-2',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-base',
  lg: 'h-14 px-7 text-lg',
};

export function buttonStyles(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  extra?: string,
) {
  return cn(base, variants[variant], sizes[size], extra);
}
