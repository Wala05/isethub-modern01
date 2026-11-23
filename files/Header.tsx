import { useState } from 'react';
import { LogIn, LogOut, Moon, Search, Sun } from 'lucide-react';
import { navItems } from '@/lib/nav';
import type { User, View } from '@/lib/types';
import type { Theme } from '@/lib/useTheme';
import { Logo } from './Logo';

type HeaderProps = {
  view: View;
  user: User | null;
  theme: Theme;
  onToggleTheme: () => void;
  onNavigate: (view: View) => void;
  onSearch: () => void;
  onLogin: () => void;
  onSignup: () => void;
  onLogout: () => void;
};

export function Header({ view, user, theme, onToggleTheme, onNavigate, onSearch, onLogin, onSignup, onLogout }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="glass sticky top-0 z-40 border-b border-slate-200/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-5 lg:px-8">
        <button onClick={() => onNavigate('accueil')} aria-label="Accueil IsetHub" className="shrink-0 text-left">
          <Logo />
        </button>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              aria-current={view === key ? 'page' : undefined}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-bold transition ${
                view === key ? 'bg-[#e8f3fb] text-[#126cb1]' : 'text-slate-500 hover:bg-slate-50 hover:text-[#126cb1]'
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onSearch}
            aria-label="Rechercher"
            className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-400 transition hover:border-[#126cb1] hover:text-[#126cb1] md:w-52"
          >
            <Search size={17} />
            <span className="hidden flex-1 text-left md:block">Rechercher…</span>
            <kbd className="hidden rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-400 md:block">⌘K</kbd>
          </button>

          <button
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-[#126cb1] hover:text-[#126cb1]"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Mon compte"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#126cb1] to-[#0a4f80] text-xs font-extrabold text-white shadow-md shadow-[#126cb1]/30"
              >
                {user.initials}
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="animate-pop-in absolute right-0 top-12 z-50 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                    <div className="px-3 py-2">
                      <p className="truncate text-sm font-extrabold">{user.name}</p>
                      <p className="truncate text-xs font-semibold text-slate-400">{user.email}</p>
                      <span className="mt-2 inline-block rounded-md bg-[#eaf5fc] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#126cb1]">{user.department}</span>
                    </div>
                    <button
                      onClick={() => { setMenuOpen(false); onLogout(); }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                    >
                      <LogOut size={16} /> Se déconnecter
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <button onClick={onLogin} className="hidden h-10 rounded-xl px-3 text-sm font-bold text-slate-600 transition hover:text-[#126cb1] sm:block">
                Se connecter
              </button>
              <button
                onClick={onSignup}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#fba831] px-3.5 text-sm font-extrabold text-[#021d33] shadow-sm transition hover:-translate-y-0.5 hover:brightness-105 sm:px-4"
              >
                <LogIn size={16} className="sm:hidden" />
                <span className="hidden sm:inline">Rejoindre</span>
                <span className="sm:hidden">Entrer</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
