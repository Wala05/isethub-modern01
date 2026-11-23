import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import { supabase } from './lib/supabase';
import { viewFromHash } from './lib/nav';
import { useTheme } from './lib/useTheme';
import type { GoFn, User, View } from './lib/types';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { Footer } from './components/layout/Footer';
import { CommandPalette } from './components/layout/CommandPalette';
import { AuthModal } from './components/auth/AuthModal';
import { HomePage } from './pages/HomePage';
import { StudiesPage } from './pages/StudiesPage';
import { LifePage } from './pages/LifePage';
import { ClubsPage } from './pages/ClubsPage';
import { MarketplacePage } from './pages/MarketplacePage';

type NavState = { view: View; sub?: string; query?: string; key: number };

function App() {
  const { theme, toggle } = useTheme();
  const [nav, setNav] = useState<NavState>(() => ({ view: viewFromHash(), key: 0 }));
  const [user, setUser] = useState<User | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimer = useRef<number | undefined>(undefined);

  // Session (localStorage + Supabase)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('isethub-user');
      if (saved) setUser(JSON.parse(saved) as User);
    } catch {
      /* données locales corrompues : on ignore */
    }
    if (supabase) {
      supabase.auth.getSession().then(({ data }) => {
        const sessionUser = data.session?.user;
        if (sessionUser) {
          setUser((current) => current ?? {
            name: sessionUser.user_metadata?.full_name ?? 'Étudiant ISET',
            email: sessionUser.email ?? '',
            department: sessionUser.user_metadata?.department ?? 'IT',
            initials: 'IS',
          });
        }
      });
    }
  }, []);

  // Bouton « retour » du navigateur
  useEffect(() => {
    const onPop = () => setNav((current) => ({ view: viewFromHash(), key: current.key + 1 }));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Raccourci ⌘K / Ctrl+K
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const notify = useCallback((message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2800);
  }, []);

  const go: GoFn = useCallback((view, sub, query) => {
    setNav((current) => ({ view, sub, query, key: current.key + 1 }));
    if (viewFromHash() !== view) window.history.pushState(null, '', view === 'accueil' ? window.location.pathname : '#' + view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openAuth = (mode: 'login' | 'signup') => { setAuthMode(mode); setAuthOpen(true); };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('isethub-user');
    supabase?.auth.signOut();
    notify('Tu es déconnecté(e).');
  };

  return (
    <div className="min-h-screen overflow-x-clip">
      <Header
        view={nav.view}
        user={user}
        theme={theme}
        onToggleTheme={toggle}
        onNavigate={(view) => go(view)}
        onSearch={() => setPaletteOpen(true)}
        onLogin={() => openAuth('login')}
        onSignup={() => openAuth('signup')}
        onLogout={logout}
      />

      {nav.view === 'accueil' && <HomePage key={nav.key} go={go} notify={notify} user={user} onSearch={() => setPaletteOpen(true)} onSignup={() => openAuth('signup')} />}
      {nav.view === 'etudes' && <StudiesPage key={nav.key} notify={notify} initialType={nav.sub} initialQuery={nav.query} />}
      {nav.view === 'vie' && <LifePage key={nav.key} notify={notify} initialTab={nav.sub} />}
      {nav.view === 'clubs' && <ClubsPage key={nav.key} notify={notify} />}
      {nav.view === 'marketplace' && <MarketplacePage key={nav.key} notify={notify} initialTab={nav.sub} />}

      <Footer go={(view) => go(view)} openAuth={() => openAuth('login')} notify={notify} />
      <BottomNav view={nav.view} onNavigate={(view) => go(view)} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} go={go} />

      {authOpen && (
        <AuthModal
          mode={authMode}
          setMode={setAuthMode}
          onClose={() => setAuthOpen(false)}
          onSuccess={(next) => {
            setUser(next);
            localStorage.setItem('isethub-user', JSON.stringify(next));
            setAuthOpen(false);
            notify('Bienvenue sur IsetHub, ' + next.name.split(' ')[0] + ' !');
          }}
        />
      )}

      {toast && (
        <div role="status" className="animate-rise fixed bottom-24 left-1/2 z-[80] flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-3 bg-[var(--ink)] px-5 py-3 text-sm font-bold text-[var(--paper)] lg:bottom-6">
          <span className="text-[10px] font-bold tracking-[.08em] opacity-50">/✓/</span>
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
