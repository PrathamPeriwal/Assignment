import * as RadixDialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { Button } from './Button';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  label?: string;
  description?: string;
  children: ReactNode;
}

const spring = { type: 'spring', stiffness: 460, damping: 34 } as const;

export function Dialog({ open, onOpenChange, title, label, description, children }: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <RadixDialog.Portal forceMount>
            <RadixDialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-40 bg-ink/55"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </RadixDialog.Overlay>
            <RadixDialog.Content
              asChild
              forceMount
              {...(description ? {} : { 'aria-describedby': undefined })}
            >
              <motion.div
                className="rule fixed inset-0 z-50 m-auto h-fit max-h-[calc(100dvh-2rem)] w-[min(calc(100vw-2rem),34rem)] overflow-y-auto rounded-sm bg-paper shadow-hard-lg"
                initial={{ opacity: 0, y: 18, rotate: -0.8 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={spring}
              >
                <header className="rule-b flex items-start justify-between gap-4 px-5 py-4">
                  <div>
                    {label && <p className="mono-label mb-1 text-ink-soft">{label}</p>}
                    <RadixDialog.Title className="font-display text-h3">{title}</RadixDialog.Title>
                    {description && (
                      <RadixDialog.Description className="mt-1 text-sm text-ink-soft">
                        {description}
                      </RadixDialog.Description>
                    )}
                  </div>
                  <RadixDialog.Close asChild>
                    <Button variant="ghost" size="sm">
                      Close
                    </Button>
                  </RadixDialog.Close>
                </header>
                <div className="px-5 py-5">{children}</div>
              </motion.div>
            </RadixDialog.Content>
          </RadixDialog.Portal>
        )}
      </AnimatePresence>
    </RadixDialog.Root>
  );
}
