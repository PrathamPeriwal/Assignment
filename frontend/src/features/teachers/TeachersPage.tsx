import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { useDocumentTitle } from '@/hooks/use-document-title';
import type { Teacher } from '@/lib/types';
import { AddTeacherForm } from './AddTeacherForm';
import { CreateSessionForm } from './CreateSessionForm';
import { TeacherList } from './TeacherList';

export function TeachersPage() {
  useDocumentTitle('Teachers');
  const [adding, setAdding] = useState(false);
  const [sessionFor, setSessionFor] = useState<Teacher | null>(null);
  const [sessionOpen, setSessionOpen] = useState(false);

  const createSession = (teacher: Teacher) => {
    setSessionFor(teacher);
    setSessionOpen(true);
  };

  return (
    <div>
      <PageHeader
        no={3}
        label="Teachers"
        title={
          <>
            Who holds <em>office hours.</em>
          </>
        }
        action={<Button onClick={() => setAdding(true)}>Add teacher</Button>}
      />

      <div className="mt-10 max-w-4xl">
        <TeacherList onAdd={() => setAdding(true)} onCreateSession={createSession} />
      </div>

      <Dialog open={adding} onOpenChange={setAdding} label="New" title="Add a teacher">
        <AddTeacherForm onDone={() => setAdding(false)} />
      </Dialog>

      <Dialog
        open={sessionOpen}
        onOpenChange={setSessionOpen}
        label="New session"
        title={sessionFor ? `Open a slot for ${sessionFor.fullName}` : 'Open a slot'}
      >
        {sessionFor && (
          <CreateSessionForm teacher={sessionFor} onDone={() => setSessionOpen(false)} />
        )}
      </Dialog>
    </div>
  );
}
