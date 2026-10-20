import { isRouteErrorResponse, Link, useRouteError } from 'react-router';
import { buttonStyles } from '../ui/button-styles';
import { SectionLabel } from '../ui/SectionLabel';

export function RouteError() {
  const error = useRouteError();
  const detail = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Unknown error';

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
      <SectionLabel no={0}>Misprint</SectionLabel>
      <h1 className="font-display mt-6 text-h1">
        This page <em>jammed</em> in the press.
      </h1>
      <p className="mono-label mt-4 text-ink-soft">{detail}</p>
      <Link to="/" className={buttonStyles('primary', 'md', 'mt-8')}>
        Back to the start
      </Link>
    </div>
  );
}
