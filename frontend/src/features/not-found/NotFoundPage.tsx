import { Link, useLocation } from 'react-router';
import { buttonStyles } from '@/components/ui/button-styles';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Stamp } from '@/components/ui/Stamp';
import { TicketShell } from '@/components/ui/TicketShell';
import { useDocumentTitle } from '@/hooks/use-document-title';

export function NotFoundPage() {
  useDocumentTitle('Not found');
  const { pathname } = useLocation();

  return (
    <section className="grid gap-10 md:grid-cols-[1fr_21rem] md:items-center">
      <div>
        <SectionLabel no={404}>Not issued</SectionLabel>
        <h1 className="font-display mt-6 text-h1">
          Nobody ever printed a ticket <em className="text-vermilion">for this address.</em>
        </h1>
        <p className="mt-6 max-w-lg text-lead text-ink-soft">
          Either the link is mistyped or the page moved. The slots you came for are still on the
          timetable.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/sessions" className={buttonStyles('primary')}>
            Browse open slots
          </Link>
          <Link to="/" className={buttonStyles('ghost')}>
            Back to the start
          </Link>
        </div>
      </div>

      <div aria-hidden="true" className="rotate-2 drop-shadow-hard">
        <TicketShell
          surface="bg-paper-2"
          main={
            <>
              <span className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-2xl font-medium tracking-tight">--:--</span>
                <span className="mono-label text-ink-soft">No date</span>
              </span>
              <span className="font-display mt-4 block text-h3">Seat unassigned</span>
              <span className="mono-label mt-2 block break-all text-ink-soft">{pathname}</span>
            </>
          }
          stub={
            <>
              <span className="mono-label">Admit none</span>
              <Stamp tone="vermilion" tilt={-8}>
                Void
              </Stamp>
            </>
          }
        />
      </div>
    </section>
  );
}
