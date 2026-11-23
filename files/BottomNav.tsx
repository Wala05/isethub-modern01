import { navItems } from '@/lib/nav';
import type { View } from '@/lib/types';

type BottomNavProps = { view: View; onNavigate: (view: View) => void };

/** Barre d’onglets fixe en bas sur mobile : tout est accessible d’un pouce. */
export function BottomNav({ view, onNavigate }: BottomNavProps) {
  return (
    <nav aria-label="Navigation mobile" className="glass safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 lg:hidden">
      <ul className="mx-auto grid max-w-lg grid-cols-5 px-2 pt-1.5">
        {navItems.map(({ key, short, icon: Icon }) => {
          const active = view === key;
          return (
            <li key={key}>
              <button
                onClick={() => onNavigate(key)}
                aria-current={active ? 'page' : undefined}
                className="flex w-full flex-col items-center gap-0.5 pb-1.5 pt-0.5"
              >
                <span className={`flex h-8 w-14 items-center justify-center rounded-full transition-all ${active ? 'bg-[#126cb1] text-white shadow-md shadow-[#126cb1]/30' : 'text-slate-400'}`}>
                  <Icon size={19} strokeWidth={active ? 2.4 : 2} />
                </span>
                <span className={`text-[10.5px] font-bold ${active ? 'text-[#126cb1]' : 'text-slate-400'}`}>{short}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
