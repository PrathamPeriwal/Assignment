import { AnimatePresence, motion } from 'motion/react';
import { useState, type ReactNode } from 'react';
import { ScrollRestoration, useLocation, useOutlet } from 'react-router';
import { Header } from './Header';

// Keeps the outgoing page rendered while it animates out
function Frozen({ children }: { children: ReactNode }) {
  const [kept] = useState(children);
  return kept;
}

export function AppShell() {
  const { pathname } = useLocation();
  const outlet = useOutlet();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className="mx-auto flex min-h-dvh max-w-6xl flex-col md:rule-l md:rule-r">
      <a
        href="#main"
        className="mono-label sr-only z-50 bg-ink px-3 py-2 text-paper focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1 px-4 py-8 sm:px-8 md:py-12">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.12 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          >
            <Frozen>{outlet}</Frozen>
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="rule-t mono-label flex flex-wrap justify-between gap-2 px-4 py-4 text-ink-soft sm:px-8">
        <span>Office Hours</span>
        <span>Times shown in {timezone}</span>
      </footer>
      <ScrollRestoration />
    </div>
  );
}
