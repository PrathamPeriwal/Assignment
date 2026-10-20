import { PagePlaceholder } from '@/components/layout/PagePlaceholder';
import { useDocumentTitle } from '@/hooks/use-document-title';

export function HomePage() {
  useDocumentTitle();

  return (
    <PagePlaceholder
      no={1}
      label="Home"
      title={
        <>
          Pick a day. <em className="text-vermilion">Take a seat.</em>
        </>
      }
    >
      <p>
        Teachers keep short, open slots. Find one that suits you, book it, and it turns up under My
        sessions.
      </p>
    </PagePlaceholder>
  );
}
