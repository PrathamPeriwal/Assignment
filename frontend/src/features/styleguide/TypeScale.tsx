const rows = [
  { token: 'text-display', className: 'font-display text-display', sample: 'Take a seat' },
  { token: 'text-h1', className: 'font-display text-h1', sample: 'Open slots, day by day' },
  { token: 'text-h2', className: 'font-display text-h2', sample: 'Who holds office hours' },
  { token: 'text-h3', className: 'font-display text-h3', sample: 'Ananya Iyer' },
  { token: 'text-lead', className: 'text-lead', sample: 'Teachers keep short, open slots.' },
  {
    token: 'text-base',
    className: 'text-base',
    sample: 'Find one that suits you, book it, and it turns up under My sessions.',
  },
  {
    token: 'text-sm',
    className: 'text-sm text-ink-soft',
    sample: 'Digits, spaces, dashes and a leading + are fine.',
  },
  { token: 'mono-label', className: 'mono-label', sample: 'Algorithms / 14 yrs' },
  {
    token: 'font-mono text-2xl',
    className: 'font-mono text-2xl font-medium tracking-tight',
    sample: '09:00 to 10:00',
  },
];

export function TypeScale() {
  return (
    <div className="rule-t">
      {rows.map((row) => (
        <div
          key={row.token}
          className="rule-b grid gap-2 py-4 sm:grid-cols-[11rem_1fr] sm:items-baseline"
        >
          <span className="mono-label text-ink-soft">{row.token}</span>
          <p className={row.className}>
            {row.token === 'text-h1' ? (
              <>
                Open slots, <em>day by day</em>
              </>
            ) : (
              row.sample
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
