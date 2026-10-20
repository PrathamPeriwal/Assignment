import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import type { Teacher } from '@/lib/types';
import { useTeachers } from './hooks';
import { TeacherCard } from './TeacherCard';
import { TeacherSkeleton } from './TeacherSkeleton';

interface TeacherListProps {
  onAdd: () => void;
  onCreateSession: (teacher: Teacher) => void;
}

export function TeacherList({ onAdd, onCreateSession }: TeacherListProps) {
  const teachers = useTeachers();

  if (teachers.isPending) {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-label="Loading teachers"
        className="flex flex-col gap-5"
      >
        <TeacherSkeleton />
        <TeacherSkeleton />
        <TeacherSkeleton />
      </div>
    );
  }

  if (teachers.isError) {
    return (
      <ErrorState
        message={teachers.error.message}
        onRetry={() => void teachers.refetch()}
        retrying={teachers.isFetching}
      />
    );
  }

  if (teachers.data.length === 0) {
    return (
      <EmptyState
        title="No teachers yet"
        actions={<Button onClick={onAdd}>Add the first teacher</Button>}
      >
        <p>Slots belong to a teacher, so add one before creating any sessions.</p>
      </EmptyState>
    );
  }

  return (
    <ul className="flex flex-col gap-5">
      {teachers.data.map((teacher) => (
        <li key={teacher._id}>
          <TeacherCard teacher={teacher} onCreateSession={onCreateSession} />
        </li>
      ))}
    </ul>
  );
}
