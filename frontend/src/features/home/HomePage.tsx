import { useDocumentTitle } from '@/hooks/use-document-title';
import { Hero } from './Hero';
import { HowItWorks } from './HowItWorks';

export function HomePage() {
  useDocumentTitle();

  return (
    <>
      <Hero />
      <HowItWorks />
    </>
  );
}
