import { createContext, useContext } from 'react';

export type ToastTone = 'neutral' | 'success' | 'error';

export interface ToastInput {
  title: string;
  description?: string;
  tone?: ToastTone;
}

export const ToastContext = createContext<((toast: ToastInput) => void) | null>(null);

export function useToast() {
  const toast = useContext(ToastContext);
  if (!toast) throw new Error('useToast needs a ToastProvider above it');
  return toast;
}
