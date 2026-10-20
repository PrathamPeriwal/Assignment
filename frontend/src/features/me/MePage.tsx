import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useActingAs } from '@/features/acting-as/context';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { MySessions } from './MySessions';

export function MePage() {
  useDocumentTitle('My sessions');
  const { actor, openPicker } = useActingAs();

  return (
    <div>
      <PageHeader
        no={4}
        label="My sessions"
        title={
          <>
            Booked, then <em>done.</em>
          </>
        }
        intro={actor ? `Showing the sessions of ${actor.fullName}.` : undefined}
      />
      <div className="mt-10">
        {actor ? (
          <MySessions key={actor.id} userId={actor.id} />
        ) : (
          <EmptyState
            title="Who are you?"
            actions={<Button onClick={openPicker}>Pick or add a person</Button>}
          >
            <p>
              There are no logins. Choose yourself from the list, or add a new person, and your
              booked and finished sessions will appear here.
            </p>
          </EmptyState>
        )}
      </div>
    </div>
  );
}
