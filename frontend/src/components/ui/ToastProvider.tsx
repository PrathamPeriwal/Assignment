import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Button } from './Button';
import { ToastContext, type ToastInput, type ToastTone } from './toast-context';

interface ToastItem extends ToastInput {
  id: number;
}

const LIFETIME_MS = 5000;
const MAX_VISIBLE = 4;

const bars: Record<ToastTone, string> = {
  neutral: 'bg-ink',
  success: 'bg-moss',
  error: 'bg-vermilion',
};

function Toast({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
  const { id } = item;

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), LIFETIME_MS);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: -32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -32, transition: { duration: 0.15 } }}
      transition={{ type: 'spring', stiffness: 500, damping: 36 }}
      className="rule pointer-events-auto flex items-stretch rounded-sm bg-paper shadow-hard"
    >
      <span aria-hidden="true" className={cn('w-2 shrink-0', bars[item.tone ?? 'neutral'])} />
      <div className="min-w-0 flex-1 px-3 py-2.5">
        <p className="font-semibold">{item.title}</p>
        {item.description && <p className="text-sm text-ink-soft">{item.description}</p>}
      </div>
      <Button variant="ghost" size="sm" className="m-1.5 self-start" onClick={() => onDismiss(id)}>
        Dismiss
      </Button>
    </motion.li>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback((input: ToastInput) => {
    nextId.current += 1;
    const item = { ...input, id: nextId.current };
    setItems((current) => [...current, item].slice(-MAX_VISIBLE));
  }, []);

  return (
    <ToastContext value={toast}>
      {children}
      <ol
        aria-live="polite"
        aria-label="Notifications"
        className="pointer-events-none fixed right-4 bottom-4 left-4 z-60 flex flex-col gap-3 sm:right-auto sm:w-96"
      >
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <Toast key={item.id} item={item} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </ol>
    </ToastContext>
  );
}
