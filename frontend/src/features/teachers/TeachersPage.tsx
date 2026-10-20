import { PagePlaceholder } from '@/components/layout/PagePlaceholder';
import { useDocumentTitle } from '@/hooks/use-document-title';

export function TeachersPage() {
  useDocumentTitle('Teachers');

  return (
    <PagePlaceholder
      no={3}
      label="Teachers"
      title={
        <>
          Who holds <em>office hours.</em>
        </>
      }
    >
      <p>The roster of teachers, with what each one teaches, goes here.</p>
    </PagePlaceholder>
  );
}
