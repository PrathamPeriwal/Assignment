import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router';
import { ActingAsButton } from '@/features/acting-as/ActingAsButton';
import { Button } from '../ui/Button';
import { NavLinks } from './NavLinks';

function Wordmark() {
  return (
    <Link to="/" className="font-display text-2xl leading-none tracking-tight">
      Office <em className="text-vermilion">Hours</em>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header
      className="rule-b"
      onKeyDown={(event) => {
        if (event.key === 'Escape') close();
      }}
    >
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
        <Wordmark />
        <nav aria-label="Main" className="hidden md:block">
          <NavLinks />
        </nav>
        <div className="hidden min-w-0 md:block">
          <ActingAsButton />
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? 'Close' : 'Menu'}
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="mobile-nav"
            className="overflow-hidden md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 38 }}
          >
            <nav aria-label="Main" className="rule-t px-4 sm:px-8">
              <NavLinks stacked onNavigate={close} />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rule-t flex px-4 py-2 sm:px-8 md:hidden">
        <ActingAsButton className="w-full" />
      </div>
    </header>
  );
}
