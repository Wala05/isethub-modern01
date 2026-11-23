import { useState } from 'react';
import { useResources } from '@/lib/resources';
import { useLocalStorage } from '@/lib/useLocalStorage';
import type { GoFn, NotifyFn, User } from '@/lib/types';

type HomePageProps = { go: GoFn; notify: NotifyFn; user: User | null; onSearch: () => void; onSignup: () => void };

type Todo = { id: string; text: string; done: boolean };

const quickActions: { label: string; hint: string; view: Parameters<GoFn>[0]; sub?: string }[] = [
  { label: 'Cours & TD', hint: 'Documents de ta promo', view: 'etudes', sub: 'Cours' },
  { label: 'Examens', hint: 'Anciens sujets', view: 'etudes', sub: 'Examen' },
  { label: 'Coloc', hint: 'Logements étudiants', view: 'vie', sub: 'logement' },
  { label: 'Covoit', hint: 'Rentre ensemble', view: 'vie', sub: 'covoit' },
  { label: 'Bons plans', hint: 'Resto, café, copy', view: 'vie', sub: 'bons' },
  { label: 'Clubs', hint: 'Events du campus', view: 'clubs' },
  { label: 'Occasions', hint: 'Achète & vends', view: 'marketplace', sub: 'shop' },
  { label: 'Entraide', hint: 'Pose ta question', view: 'marketplace', sub: 'forum' },
];

const heroTags: { label: string; view: Parameters<GoFn>[0]; sub?: string }[] = [
  { label: 'Examens', view: 'etudes', sub: 'Examen' },
  { label: 'Coloc', view: 'vie', sub: 'logement' },
  { label: 'Covoit', view: 'vie', sub: 'covoit' },
  { label: 'Clubs', view: 'clubs' },
];

const deals = [
  { title: 'Café El Bahri', text: 'Café calme, prises partout, -10% étudiants', meta: 'Houmt Souk · 1.2 km' },
  { title: 'Mamma Mia', text: 'Plat du jour étudiant à 8 DT', meta: 'Midoun · 2.4 km' },
  { title: 'Copy Center ISET', text: 'Impression couleur à partir de 0.400 DT', meta: 'À côté du campus' },
];

const pillars = [
  { title: 'Zéro stress pour les cours', text: 'Retrouve cours, examens, TD et résumés partagés par les étudiants de ton département.' },
  { title: 'La vraie vie étudiante', text: 'Coloc, covoit, bons plans, cafés calmes et imprimeries à portée de clic.' },
  { title: 'Vivre l’ISET à fond', text: 'Découvre les clubs, les événements et rencontre les gens qui te ressemblent.' },
];

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bonjour';
  if (hour < 18) return 'Bon après-midi';
  return 'Bonsoir';
}

export function HomePage({ go, user, onSearch, onSignup }: HomePageProps) {
  const { resources } = useResources();
  const [favs] = useLocalStorage<string[]>('isethub-favs', []);
  const trending = [...resources].sort((a, b) => b.votes - a.votes).slice(0, 3);
  const saved = resources.filter((resource) => favs.includes(resource.id));
  const firstName = user?.name.split(' ')[0];

  return (
    <main className="pb-24 lg:pb-12">
      {/* ───────── Hero ───────── */}
      <section className="border-b border-[var(--line)]">
        <div className="container-page grid gap-12 py-14 sm:py-20 lg:grid-cols-[1.15fr_.85fr] lg:items-start lg:py-24">
          <div className="animate-rise">
            <p className="eyebrow">{firstName ? `${greeting()}, ${firstName}` : 'IsetHub — ISET Djerba'}</p>
            <h1 className="mt-5 text-5xl font-extrabold leading-[1.02] tracking-[-.035em] sm:text-7xl">
              Ta vie à l’ISET,<br /><span className="text-[var(--accent)]">enfin simple.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-[var(--ink-soft)] sm:text-lg sm:leading-8">
              Cours, examens, coloc, covoit, clubs et bons plans. Tout ce qu’il te faut, au même endroit, partagé entre étudiants.
            </p>

            <button
              onClick={onSearch}
              className="mt-9 flex h-14 w-full max-w-xl items-center justify-between border border-[var(--line)] bg-[var(--surface)] px-5 text-left transition hover:border-[var(--ink)]"
            >
              <span className="text-base font-semibold text-[var(--ink-faint)]">Que cherches-tu aujourd’hui ?</span>
              <span className="index-tag hidden sm:block">⌘ K</span>
            </button>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
              {heroTags.map((tag) => (
                <button key={tag.label} onClick={() => go(tag.view, tag.sub)} className="link-underline text-sm font-bold">{tag.label}</button>
              ))}
            </div>
          </div>

          <MySpace user={user} savedCount={saved.length} go={go} onSignup={onSignup} />
        </div>
      </section>

      {/* ───────── Accès rapide (liste éditoriale numérotée) ───────── */}
      <section className="container-page py-16 sm:py-20" aria-label="Accès rapide">
        <div className="rule-strong mb-10 flex items-end justify-between gap-4 pt-6">
          <div>
            <p className="eyebrow">Accès rapide</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Huit raccourcis vers l’essentiel.</h2>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map(({ label, hint, view, sub }, index) => (
            <button
              key={label}
              onClick={() => go(view, sub)}
              className="group hairline flex flex-col gap-1 py-5 pr-4 text-left transition hover:bg-[var(--surface-2)] sm:pl-5"
            >
              <span className="index-tag transition group-hover:text-[var(--accent)]">/{String(index + 1).padStart(2, '0')}/</span>
              <span className="text-lg font-extrabold tracking-tight">{label}</span>
              <span className="text-sm font-semibold text-[var(--ink-faint)]">{hint}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ───────── Favoris ───────── */}
      {saved.length > 0 && (
        <section className="border-y border-[var(--line)] bg-[var(--surface-2)]">
          <div className="container-page py-16 sm:py-20">
            <SectionTitle eyebrow="Tes favoris" title="À portée de main" action={{ label: 'Tout voir', onClick: () => go('etudes') }} />
            <div className="no-scrollbar -mx-5 flex snap-x gap-px overflow-x-auto bg-[var(--line)] px-5 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
              {saved.slice(0, 4).map((resource, index) => (
                <button key={resource.id} onClick={() => go('etudes', undefined, resource.title)} className="min-w-[260px] snap-start bg-[var(--surface)] p-6 text-left transition hover:bg-[var(--paper)] sm:min-w-0">
                  <span className="index-tag">/{String(index + 1).padStart(2, '0')}/</span>
                  <h3 className="mt-3 line-clamp-2 text-base font-extrabold leading-snug">{resource.title}</h3>
                  <p className="mt-3 text-xs font-bold uppercase tracking-[.12em] text-[var(--ink-faint)]">{resource.resource_type} · {resource.department} · {resource.semester}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────── Ressources populaires + bons plans ───────── */}
      <section className="container-page grid gap-14 py-16 sm:py-20 lg:grid-cols-[1.15fr_.85fr]">
        <div>
          <SectionTitle eyebrow="Populaires" title="Les ressources qui aident le plus" action={{ label: 'Tout voir', onClick: () => go('etudes') }} />
          <div>
            {trending.map((item, index) => (
              <button key={item.id} onClick={() => go('etudes', undefined, item.title)} className="group hairline flex w-full items-baseline gap-5 py-5 text-left transition hover:bg-[var(--surface-2)] sm:px-4">
                <span className="index-tag w-10 shrink-0 transition group-hover:text-[var(--accent)]">/{String(index + 1).padStart(2, '0')}/</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-lg font-extrabold tracking-tight">{item.title}</span>
                  <span className="mt-1 block text-xs font-bold uppercase tracking-[.12em] text-[var(--ink-faint)]">{item.resource_type} · {item.department} · {item.semester}</span>
                </span>
                <span className="index-tag shrink-0 !text-sm !text-[var(--ink)]">▲ {item.votes}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#101820] p-7 text-white sm:p-9">
          <p className="text-[11px] font-extrabold uppercase tracking-[.22em] text-white/50">Cette semaine</p>
          <h3 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Bons plans étudiants</h3>
          <div className="mt-6">
            {deals.map((deal, index) => (
              <button key={deal.title} onClick={() => go('vie', 'bons')} className="group flex w-full gap-4 border-t border-white/10 py-4 text-left transition hover:bg-white/5">
                <span className="index-tag !text-white/40 transition group-hover:!text-[var(--accent)]">/{String(index + 1).padStart(2, '0')}/</span>
                <span>
                  <span className="block font-extrabold">{deal.title}</span>
                  <span className="mt-0.5 block text-sm text-white/70">{deal.text}</span>
                  <span className="mt-1 block text-xs font-semibold text-white/40">{deal.meta}</span>
                </span>
              </button>
            ))}
          </div>
          <button onClick={() => go('vie', 'bons')} className="btn btn-accent mt-7 w-full uppercase tracking-[.1em]">Voir tous les bons plans</button>
        </div>
      </section>

      {/* ───────── Pourquoi IsetHub ───────── */}
      <section className="border-y border-[var(--line)] bg-[var(--surface-2)]">
        <div className="container-page py-16 sm:py-20">
          <SectionTitle eyebrow="Pourquoi IsetHub ?" title="Une seule place pour tout simplifier." />
          <div className="grid gap-px bg-[var(--line)] md:grid-cols-3">
            {pillars.map((pillar, index) => (
              <div key={pillar.title} className="bg-[var(--surface)] p-7 transition hover:bg-[var(--paper)]">
                <span className="index-tag !text-[var(--accent)]">/{String(index + 1).padStart(2, '0')}/</span>
                <h3 className="mt-4 text-xl font-extrabold tracking-tight">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── CTA pleine largeur ───────── */}
      {!user && (
        <section className="bg-[var(--accent)] text-white">
          <div className="container-page grid items-center gap-8 py-16 sm:py-20 lg:grid-cols-[1.2fr_.8fr]">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[.22em] text-white/60">Rejoins ta communauté ISET</p>
              <h2 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-[-.03em] sm:text-5xl">
                Compte gratuit avec ton email @iset.tn.
              </h2>
              <p className="mt-4 max-w-lg text-base leading-7 text-white/85">
                Enregistre tes favoris, partage des documents et ne rate plus rien.
              </p>
            </div>
            <div className="lg:justify-self-end">
              <button onClick={onSignup} className="btn bg-[var(--ink)] text-[var(--paper)] px-8 uppercase tracking-[.1em] hover:bg-white hover:text-[var(--ink)]">
                Créer mon compte
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

/* ═════════ Sous-composants ═════════ */

function SectionTitle({ eyebrow, title, action }: { eyebrow: string; title: string; action?: { label: string; onClick: () => void } }) {
  return (
    <div className="rule-strong mb-8 flex items-end justify-between gap-4 pt-6">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h2>
      </div>
      {action && <button onClick={action.onClick} className="btn btn-line shrink-0 text-xs uppercase tracking-[.12em]">{action.label}</button>}
    </div>
  );
}

/** Petit tableau de bord perso : date, rappels, favoris. Donne une raison de revenir chaque jour. */
function MySpace({ user, savedCount, go, onSignup }: { user: User | null; savedCount: number; go: GoFn; onSignup: () => void }) {
  const [todos, setTodos] = useLocalStorage<Todo[]>('isethub-todos', []);
  const [draft, setDraft] = useState('');
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const remaining = todos.filter((todo) => !todo.done).length;

  const add = () => {
    const text = draft.trim();
    if (!text) return;
    setTodos((current) => [{ id: String(Date.now()), text, done: false }, ...current]);
    setDraft('');
  };

  return (
    <div className="animate-rise border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm" style={{ animationDelay: '.08s' }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow normal-case tracking-[.08em]">{today}</p>
          <h3 className="mt-2 text-2xl font-extrabold tracking-tight">{user ? `Ton espace, ${user.name.split(' ')[0]}` : 'Ton espace du jour'}</h3>
        </div>
        <button onClick={() => go('etudes')} className="index-tag shrink-0 border border-[var(--line)] px-2.5 py-1.5 transition hover:border-[var(--accent)] hover:text-[var(--accent)]">
          {savedCount} fav
        </button>
      </div>

      <div className="hairline mt-5 flex items-center justify-between pt-4">
        <p className="text-sm font-extrabold">Mes rappels</p>
        <span className="index-tag">{todos.length === 0 ? 'Rien pour l’instant' : `${remaining} à faire`}</span>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') add(); }}
          placeholder="Ex. rendre le TP de réseaux"
          aria-label="Ajouter un rappel"
          className="h-11 min-w-0 flex-1 border border-[var(--line)] px-3 text-sm font-semibold outline-none transition focus:border-[var(--accent)]"
        />
        <button onClick={add} aria-label="Ajouter" className="btn btn-primary !min-h-11 shrink-0 px-4">+</button>
      </div>

      <ul className="mt-4">
        {todos.slice(0, 4).map((todo, index) => (
          <li key={todo.id} className="group flex items-center gap-3 border-t border-[var(--line)] py-2.5">
            <span className="index-tag w-7 shrink-0">/{String(index + 1).padStart(2, '0')}/</span>
            <button
              onClick={() => setTodos((current) => current.map((item) => (item.id === todo.id ? { ...item, done: !item.done } : item)))}
              aria-label={todo.done ? 'Marquer comme à faire' : 'Marquer comme fait'}
              className={`h-4 w-4 shrink-0 border transition ${todo.done ? 'border-[var(--accent)] bg-[var(--accent)]' : 'border-[var(--ink-faint)] hover:border-[var(--ink)]'}`}
            />
            <span className={`min-w-0 flex-1 truncate text-sm font-semibold ${todo.done ? 'text-[var(--ink-faint)] line-through' : ''}`}>{todo.text}</span>
            <button onClick={() => setTodos((current) => current.filter((item) => item.id !== todo.id))} aria-label="Supprimer" className="index-tag shrink-0 transition hover:!text-[var(--accent)]">✕</button>
          </li>
        ))}
        {todos.length > 4 && <li className="border-t border-[var(--line)] py-2.5"><span className="index-tag">+ {todos.length - 4} autre{todos.length - 4 > 1 ? 's' : ''}</span></li>}
      </ul>

      {!user && (
        <div className="hairline mt-4 pt-4">
          <button onClick={onSignup} className="link-underline text-sm font-extrabold">Crée ton compte pour tout garder</button>
        </div>
      )}
    </div>
  );
}
