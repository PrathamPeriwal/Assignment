import { Link } from 'react-router';
import { buttonStyles } from '@/components/ui/button-styles';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { steps } from './steps';

export function HowItWorks() {
  return (
    <section className="mt-20 md:mt-28" aria-labelledby="how-heading">
      <SectionLabel no={2}>How it works</SectionLabel>
      <h2 id="how-heading" className="sr-only">
        How it works
      </h2>
      <ol className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-12">
        {steps.map((step, index) => (
          <li key={step.title} className={step.placement}>
            <div className="rule-t flex items-start gap-5 pt-4 sm:gap-8">
              <span
                aria-hidden="true"
                className="font-display text-display leading-none text-vermilion"
              >
                {index + 1}
              </span>
              <div className="max-w-md pt-2">
                <h3 className="font-display text-h2 text-balance">{step.title}</h3>
                <p className="mt-3 text-ink-soft">{step.body}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <div className="rule-t mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 pt-6">
        <Link to="/sessions" className={buttonStyles('primary', 'lg')}>
          See what is open
        </Link>
        <Link to="/teachers" className="mono-label underline underline-offset-4">
          Or look at who teaches
        </Link>
      </div>
    </section>
  );
}
