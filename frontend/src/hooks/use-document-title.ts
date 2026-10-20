import { useEffect } from 'react';

const SITE = 'Office Hours';

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE}` : SITE;
  }, [title]);
}
