import { startOfDay } from 'date-fns';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useAvailableSessions } from '@/features/sessions/hooks';
import { useTeachers } from '@/features/teachers/hooks';
import { liveLine } from './copy';

export function LiveLine() {
  const [today] = useState(() => startOfDay(new Date()));
  const teachers = useTeachers();
  const sessions = useAvailableSessions(today);

  return (
    <p className="mt-5 flex min-h-6 items-center font-mono text-sm">
      {teachers.isSuccess && sessions.isSuccess && (
        <motion.span
          className="flex items-center gap-2.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span aria-hidden="true" className="size-2 shrink-0 animate-ink-pulse bg-moss" />
          {liveLine(teachers.data.length, sessions.data.length)}
        </motion.span>
      )}
    </p>
  );
}
