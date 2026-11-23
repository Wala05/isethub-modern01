import { navItems } from '@/lib/nav';
import type { View } from '@/lib/types';

type BottomNavProps = { view: View; onNavigate: (view: View) => void };

/** Barre d’onglets fixe en bas sur mobile : tout est accessible d’un pouce. */
export function BottomNav({ view, onNavigate }: BottomNavProps) {
  return (
    <nav aria-label="Navigation mobile" className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-[var(--paper)] lg:hidden">
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-3">
        {navItems.map(({ key, short }) => {
          const active = view === key;
          return (
            <li key={key} className="flex-1">
              <button
                onClick={() => onNavigate(key)}
                aria-current={active ? 'page' : undefined}
                className="flex w-full flex-col items-center gap-0.5 py-2.5"
              >
                <span className={`text-[10px] font-bold tracking-[.08em] ${active ? 'text-[var(--accent)]' : 'text-[var(--ink-faint)]'}`}>
                  /{String(navItems.indexOf(navItems.find((item) => item.key === key)! ) + 1).padStart(2, '0')}/
                </span>
                <span className={`text-[11px] font-extrabold ${active ? 'text-[var(--ink)]' : 'text-[var(--ink-faint)]'}`}>{short}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
