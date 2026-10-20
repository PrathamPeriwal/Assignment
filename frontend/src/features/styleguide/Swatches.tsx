import { cn } from '@/lib/cn';

const swatches = [
  { name: 'paper', hex: '#F2ECDF', className: 'bg-paper' },
  { name: 'paper-2', hex: '#E9E1D0', className: 'bg-paper-2' },
  { name: 'ink', hex: '#17150F', className: 'bg-ink' },
  { name: 'ink-soft', hex: '#5C574B', className: 'bg-ink-soft' },
  { name: 'vermilion', hex: '#E2452B', className: 'bg-vermilion' },
  { name: 'moss', hex: '#2E4B3C', className: 'bg-moss' },
  { name: 'butter', hex: '#F3D56B', className: 'bg-butter' },
];

export function Swatches() {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
      {swatches.map((swatch) => (
        <li key={swatch.name}>
          <div className={cn('rule h-20 rounded-sm', swatch.className)} />
          <p className="mono-label mt-2">{swatch.name}</p>
          <p className="font-mono text-xs text-ink-soft">{swatch.hex}</p>
        </li>
      ))}
    </ul>
  );
}
