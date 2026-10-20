import { Button } from '@/components/ui/Button';
import { shortId } from '@/lib/format';
import type { Teacher } from '@/lib/types';

interface TeacherCardProps {
  teacher: Teacher;
  onCreateSession: (teacher: Teacher) => void;
}

export function TeacherCard({ teacher, onCreateSession }: TeacherCardProps) {
  return (
    <article className="rule rounded-sm bg-paper shadow-hard-sm">
      <div className="mono-label flex items-center justify-between px-4 pt-3 text-ink-soft">
        <span>Teacher</span>
        <span className="font-normal">#{shortId(teacher._id)}</span>
      </div>
      <span aria-hidden="true" className="mx-4 mt-2 block h-0.5 bg-vermilion" />
      <div className="grid gap-4 px-4 py-4 sm:grid-cols-[1fr_auto] sm:items-end sm:gap-8">
        <div className="min-w-0">
          <h2 className="font-display text-h3 text-balance">{teacher.fullName}</h2>
          <p className="mt-1 text-ink-soft">{teacher.specialization}</p>
        </div>
        <div className="flex items-center justify-between gap-5">
          <p className="mono-label text-ink">
            {teacher.experience} {teacher.experience === 1 ? 'yr' : 'yrs'}
          </p>
          <Button
            variant="secondary"
            size="sm"
            aria-label={`Create session for ${teacher.fullName}`}
            onClick={() => onCreateSession(teacher)}
          >
            Create session
          </Button>
        </div>
      </div>
    </article>
  );
}
