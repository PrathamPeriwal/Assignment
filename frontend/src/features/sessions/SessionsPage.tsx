import { PagePlaceholder } from '@/components/layout/PagePlaceholder';
import { useDocumentTitle } from '@/hooks/use-document-title';

export function SessionsPage() {
  useDocumentTitle('Browse');

  return (
    <PagePlaceholder
      no={2}
      label="Browse"
      title={
        <>
          Open slots, <em>day by day.</em>
        </>
      }
    >
      <p>The day picker and the list of open slots go here.</p>
    </PagePlaceholder>
  );
}
