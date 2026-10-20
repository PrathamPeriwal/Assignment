import { Link } from 'react-router';
import { navLinks } from './links';

export function Footer() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <footer className="rule-t">
      <div className="grid gap-x-8 gap-y-8 px-4 py-10 sm:px-8 md:grid-cols-12 md:py-12">
        <div className="md:col-span-6">
          <p className="font-display text-h2">
            Office <em className="text-vermilion">Hours</em>
          </p>
          <p className="mt-3 max-w-sm text-ink-soft">
            Short, open hours with people who know the subject. Book one, turn up, get it stamped.
          </p>
        </div>
        <nav aria-label="Footer" className="md:col-span-3">
          <p className="mono-label text-ink-soft">Pages</p>
          <ul className="mt-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="inline-flex min-h-10 items-center underline-offset-4 hover:underline hover:decoration-vermilion hover:decoration-2"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-3">
          <p className="mono-label text-ink-soft">Clock</p>
          <p className="mt-4 font-mono text-sm">
            Times shown in
            <span className="block break-all text-ink-soft">{timezone}</span>
          </p>
        </div>
      </div>
      <div className="rule-t mono-label flex flex-wrap justify-between gap-2 border-dashed px-4 py-3 text-ink-soft sm:px-8">
        <span>Admit one</span>
        <span>Keep this stub</span>
      </div>
    </footer>
  );
}
