import { useState } from 'react';
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
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--paper)]/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <button onClick={() => onNavigate('accueil')} aria-label="Accueil IsetHub" className="shrink-0">
          <Logo />
        </button>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigation principale">
          {navItems.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              aria-current={view === key ? 'page' : undefined}
              className={`border-b-2 pb-1 text-sm font-bold tracking-wide transition ${
                view === key ? 'border-[var(--accent)] text-[var(--ink)]' : 'border-transparent text-[var(--ink-soft)] hover:text-[var(--ink)]'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onSearch}
            aria-label="Rechercher"
            className="hidden text-sm font-bold text-[var(--ink-soft)] transition hover:text-[var(--ink)] md:block"
          >
            Rechercher <span className="ml-1 rounded border border-[var(--line)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--ink-faint)]">⌘K</span>
          </button>

          <button
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
            className="text-[11px] font-extrabold uppercase tracking-[.14em] text-[var(--ink-soft)] transition hover:text-[var(--ink)]"
          >
            {theme === 'dark' ? 'Clair' : 'Sombre'}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Mon compte"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--ink)] text-xs font-extrabold text-[var(--paper)]"
              >
                {user.initials}
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="animate-fade absolute right-0 top-12 z-50 w-64 border border-[var(--line)] bg-[var(--surface)] p-5 shadow-xl">
                    <p className="truncate text-sm font-extrabold">{user.name}</p>
                    <p className="mt-0.5 truncate text-xs font-semibold text-[var(--ink-faint)]">{user.email}</p>
                    <span className="index-tag mt-3 inline-block uppercase">{user.department}</span>
                    <div className="hairline mt-4 pt-3">
                      <button
                        onClick={() => { setMenuOpen(false); onLogout(); }}
                        className="text-sm font-bold text-[var(--ink-soft)] transition hover:text-[var(--accent)]"
                      >
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <button onClick={onLogin} className="hidden text-sm font-bold text-[var(--ink-soft)] transition hover:text-[var(--ink)] sm:block">
                Se connecter
              </button>
              <button onClick={onSignup} className="btn btn-primary !min-h-10 px-4 text-xs uppercase tracking-[.12em]">
                Rejoindre
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
