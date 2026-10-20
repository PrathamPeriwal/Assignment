import { Ticket } from '@/components/ui/Ticket';
import { TicketSkeleton } from '@/components/ui/TicketSkeleton';
import { useToast } from '@/components/ui/toast-context';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { Buttons, Fields, Overlays, Skeletons, Stamps, Toasts } from './Controls';
import { availableTicket, bookedTicket, completedTicket } from './mock';
import { Section } from './Section';
import { Swatches } from './Swatches';
import { TypeScale } from './TypeScale';

export function StyleguidePage() {
  useDocumentTitle('Styleguide');
  const toast = useToast();

  return (
    <div>
      <p className="mono-label text-ink-soft">Dev only</p>
      <h1 className="font-display mt-3 text-h1">
        The <em className="text-vermilion">styleguide.</em>
      </h1>

      <Section no={1} title="Type">
        <TypeScale />
      </Section>
      <Section no={2} title="Colour">
        <Swatches />
      </Section>
      <Section no={3} title="Buttons">
        <Buttons />
      </Section>
      <Section no={4} title="Fields">
        <Fields />
      </Section>
      <Section no={5} title="Dialog and picker">
        <Overlays />
      </Section>
      <Section no={6} title="Toasts">
        <Toasts />
      </Section>
      <Section no={7} title="Stamps">
        <Stamps />
      </Section>
      <Section no={8} title="Tickets">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="mono-label mb-3 text-ink-soft">Available</p>
            <Ticket
              session={availableTicket}
              variant="available"
              onSelect={(session) =>
                toast({
                  title: `Picked ${session.teacher.fullName}`,
                  description: 'Ticket click works.',
                })
              }
            />
          </div>
          <div>
            <p className="mono-label mb-3 text-ink-soft">Booked</p>
            <Ticket session={bookedTicket} variant="booked" />
          </div>
          <div>
            <p className="mono-label mb-3 text-ink-soft">Completed</p>
            <Ticket session={completedTicket} variant="completed" />
          </div>
          <div>
            <p className="mono-label mb-3 text-ink-soft">Loading</p>
            <TicketSkeleton />
          </div>
        </div>
      </Section>
      <Section no={9} title="Skeleton">
        <Skeletons />
      </Section>
    </div>
  );
}
