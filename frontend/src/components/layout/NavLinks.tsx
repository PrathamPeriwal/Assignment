import { NavLink } from 'react-router';
import { cn } from '@/lib/cn';

const links = [
  { to: '/', label: 'Home' },
  { to: '/sessions', label: 'Browse' },
  { to: '/teachers', label: 'Teachers' },
  { to: '/me', label: 'My sessions' },
];

interface NavLinksProps {
  stacked?: boolean;
  onNavigate?: () => void;
}

export function NavLinks({ stacked, onNavigate }: NavLinksProps) {
  return (
    <ul className={cn('flex', stacked ? 'flex-col' : 'items-center gap-1')}>
      {links.map((link) => (
        <li key={link.to} className={cn(stacked && 'rule-b last:border-b-0')}>
          <NavLink
            to={link.to}
            end={link.to === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'mono-label block transition-colors duration-200',
                stacked ? 'px-1 py-4 text-sm' : 'px-3 py-2',
                isActive
                  ? 'text-ink shadow-[inset_0_-3px_0_var(--color-vermilion)]'
                  : 'text-ink-soft hover:text-ink',
              )
            }
          >
            {link.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
