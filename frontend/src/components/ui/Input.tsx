import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { controlStyles } from './control-styles';

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(controlStyles, className)} {...props} />;
}
