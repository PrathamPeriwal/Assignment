import { PagePlaceholder } from '@/components/layout/PagePlaceholder';
import { Button } from '@/components/ui/Button';
import { useActingAs } from '@/features/acting-as/context';
import { useDocumentTitle } from '@/hooks/use-document-title';

export function MePage() {
  useDocumentTitle('My sessions');
  const { actor, openPicker } = useActingAs();

  return (
    <PagePlaceholder
      no={4}
      label="My sessions"
      title={
        <>
          Booked, then <em>done.</em>
        </>
      }
    >
      {actor ? (
        <p>Upcoming and completed sessions for {actor.fullName} go here.</p>
      ) : (
        <div className="flex flex-col items-start gap-4">
          <p>Say who you are and your upcoming and completed sessions will show up here.</p>
          <Button onClick={openPicker}>Pick who you are</Button>
        </div>
      )}
    </PagePlaceholder>
  );
}
