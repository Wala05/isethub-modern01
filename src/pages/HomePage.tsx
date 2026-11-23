import { useState } from 'react';
import {
  ArrowRight, Bookmark, BookOpen, Calendar, Car, Check, FileText, GraduationCap, Home, MessageCircle, Plus,
  Search, ShoppingBag, Sparkles, Store, ThumbsUp, Trash2, Trophy, Users, type LucideIcon,
} from 'lucide-react';
import { useResources } from '@/lib/resources';
import { useLocalStorage } from '@/lib/useLocalStorage';
import type { GoFn, NotifyFn, User } from '@/lib/types';

type HomePageProps = { go: GoFn; notify: NotifyFn; user: User | null; onSearch: () => void; onSignup: () => void };

type Todo = { id: string; text: string; done: boolean };

const quickActions: { label: string; hint: string; icon: LucideIcon; tone: string; view: Parameters<GoFn>[0]; sub?: string }[] = [
  { label: 'Cours & TD', hint: 'Documents de ta promo', icon: BookOpen, tone: 'bg-[#eaf5fc] text-[#126cb1]', view: 'etudes', sub: 'Cours' },
  { label: 'Examens', hint: 'Anciens sujets', icon: GraduationCap, tone: 'bg-[#eaf5fc] text-[#126cb1]', view: 'etudes', sub: 'Examen' },
  { label: 'Coloc', hint: 'Logements étudiants', icon: Home, tone: 'bg-[#fff4df] text-[#d4840f]', view: 'vie', sub: 'logement' },
  { label: 'Covoit', hint: 'Rentre ensemble', icon: Car, tone: 'bg-[#fff4df] text-[#d4840f]', view: 'vie', sub: 'covoit' },
  { label: 'Bons plans', hint: 'Resto, café, copy', icon: Store, tone: 'bg-[#e8f7f0] text-[#15915c]', view: 'vie', sub: 'bons' },
  { label: 'Clubs', hint: 'Events du campus', icon: Users, tone: 'bg-[#e8f7f0] text-[#15915c]', view: 'clubs' },
  { label: 'Occasions', hint: 'Achète & vends', icon: ShoppingBag, tone: 'bg-[#eaf5fc] text-[#126cb1]', view: 'marketplace', sub: 'shop' },
  { label: 'Entraide', hint: 'Pose ta question', icon: MessageCircle, tone: 'bg-[#fff4df] text-[#d4840f]', view: 'marketplace', sub: 'forum' },
];

const heroTags: { label: string; view: Parameters<GoFn>[0]; sub?: string }[] = [
  { label: 'Examens', view: 'etudes', sub: 'Examen' },
  { label: 'Coloc', view: 'vie', sub: 'logement' },
  { label: 'Covoit', view: 'vie', sub: 'covoit' },
  { label: 'Clubs', view: 'clubs' },
];

const deals = [
  { icon: '☕', title: 'Café El Bahri', text: 'Café calme, prises partout, -10% étudiants', meta: 'Houmt Souk · 1.2 km' },
  { icon: '🍝', title: 'Mamma Mia', text: 'Plat du jour étudiant à 8 DT', meta: 'Midoun · 2.4 km' },
  { icon: '🖨', title: 'Copy Center ISET', text: 'Impression couleur à partir de 0.400 DT', meta: 'À côté du campus' },
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
      <section className="hero-mesh relative overflow-hidden text-white">
        <div className="hero-grid absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 pb-20 pt-10 sm:px-5 sm:pb-24 sm:pt-16 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:px-8 lg:pb-28">
          <div className="animate-float-in">
            <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold backdrop-blur">
              <Sparkles size={14} className="shrink-0 text-[#fba831]" />
              {firstName ? `${greeting()} ${firstName} 👋` : 'Le nouveau réflexe des étudiants ISET'}
            </div>
            <h1 className="text-[2.5rem] font-extrabold leading-[1.04] tracking-[-.035em] sm:text-6xl">
              Ta vie à l’ISET,<br /><span className="text-gradient">enfin simple.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-blue-100 sm:text-lg">
              Cours, examens, coloc, covoit, clubs et bons plans. Tout ce qu’il te faut, au même endroit, partagé entre étudiants.
            </p>

            <button
              onClick={onSearch}
              className="mt-7 flex h-14 w-full max-w-xl items-center gap-3 rounded-2xl bg-white px-4 text-left text-slate-400 shadow-2xl shadow-black/20 transition hover:-translate-y-0.5"
            >
              <Search size={20} className="shrink-0 text-[#126cb1]" />
              <span className="flex-1 truncate text-base font-semibold">Que cherches-tu aujourd’hui ?</span>
              <kbd className="hidden rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-400 sm:block">⌘ K</kbd>
            </button>
            <div className="mt-4 flex flex-wrap gap-2">
              {heroTags.map((tag) => (
                <button key={tag.label} onClick={() => go(tag.view, tag.sub)} className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur transition hover:bg-white/20">{tag.label}</button>
              ))}
            </div>
          </div>

          <MySpace user={user} savedCount={saved.length} go={go} onSignup={onSignup} />
        </div>
      </section>

      {/* ───────── Accès rapide ───────── */}
      <section className="relative z-10 mx-auto -mt-12 max-w-7xl px-4 sm:-mt-14 sm:px-5 lg:px-8" aria-label="Accès rapide">
        <div className="grid grid-cols-4 gap-2 rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-lift sm:gap-3 sm:p-4 lg:grid-cols-8">
          {quickActions.map(({ label, hint, icon: Icon, tone, view, sub }) => (
            <button key={label} onClick={() => go(view, sub)} className="group flex flex-col items-center gap-2 rounded-2xl px-1 py-3 text-center transition hover:bg-slate-50 active:scale-95">
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl transition group-hover:-translate-y-0.5 group-hover:shadow-md sm:h-14 sm:w-14 ${tone}`}><Icon size={22} /></span>
              <span className="text-[11.5px] font-extrabold leading-tight sm:text-sm">{label}</span>
              <span className="hidden text-[11px] font-semibold text-slate-400 lg:block">{hint}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ───────── Favoris ───────── */}
      {saved.length > 0 && (
        <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-5 lg:px-8">
          <SectionTitle eyebrow="Tes favoris" title="À portée de main" action={{ label: 'Tout voir', onClick: () => go('etudes') }} />
          <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {saved.slice(0, 4).map((resource) => (
              <button key={resource.id} onClick={() => go('etudes', undefined, resource.title)} className="min-w-[250px] snap-start rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lift sm:min-w-0">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-[#eef7fd] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#126cb1]">{resource.resource_type}</span>
                  <Bookmark size={16} fill="currentColor" className="text-[#fba831]" />
                </div>
                <h3 className="mt-3 line-clamp-2 text-sm font-extrabold leading-snug">{resource.title}</h3>
                <p className="mt-2 text-xs font-semibold text-slate-400">{resource.department} · {resource.semester}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ───────── Ressources + bons plans ───────── */}
      <section className="mx-auto mt-12 grid max-w-7xl gap-5 px-4 sm:px-5 lg:grid-cols-[1.15fr_.85fr] lg:px-8">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
          <SectionTitle eyebrow="Populaires" title="Les ressources qui aident le plus" action={{ label: 'Tout voir', onClick: () => go('etudes') }} compact />
          {trending.map((item, index) => (
            <button key={item.id} onClick={() => go('etudes', undefined, item.title)} className="group flex w-full items-center gap-4 border-t border-slate-100 py-4 text-left first:border-0">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eaf5fc] text-[#126cb1] transition group-hover:scale-105"><FileText size={20} /></span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-extrabold">{item.title}</span>
                <span className="mt-1 block text-xs font-semibold text-slate-400">{item.resource_type} · {item.department} · {item.semester}</span>
              </span>
              <span className="flex items-center gap-1 rounded-full bg-[#fff4df] px-2.5 py-1 text-xs font-extrabold text-[#d4840f]"><ThumbsUp size={13} /> {item.votes}</span>
              {index === 0 && <span className="hidden rounded-full bg-[#fba831] px-2 py-0.5 text-[10px] font-extrabold uppercase text-[#021d33] sm:block">Top</span>}
            </button>
          ))}
        </div>

        <div className="rounded-[1.75rem] bg-gradient-to-br from-[#021d33] to-[#0a4f80] p-5 text-white shadow-lift sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fba831] text-[#021d33]"><Sparkles size={19} /></span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-blue-200">Cette semaine</p>
              <h3 className="text-xl font-extrabold">Bons plans étudiants</h3>
            </div>
          </div>
          {deals.map((deal) => (
            <button key={deal.title} onClick={() => go('vie', 'bons')} className="flex w-full gap-3 border-t border-white/10 py-4 text-left transition hover:bg-white/5">
              <span className="text-2xl">{deal.icon}</span>
              <span>
                <span className="block font-extrabold">{deal.title}</span>
                <span className="mt-0.5 block text-sm text-blue-100">{deal.text}</span>
                <span className="mt-1 block text-xs font-semibold text-blue-200/70">{deal.meta}</span>
              </span>
            </button>
          ))}
          <button onClick={() => go('vie', 'bons')} className="mt-2 inline-flex items-center gap-2 text-sm font-extrabold text-[#fba831]">Voir tous les bons plans <ArrowRight size={15} /></button>
        </div>
      </section>

      {/* ───────── Pourquoi IsetHub ───────── */}
      <section className="mx-auto mt-14 max-w-7xl px-4 sm:px-5 lg:px-8">
        <SectionTitle eyebrow="Pourquoi IsetHub ?" title="Une seule place pour tout simplifier." />
        <div className="grid gap-4 md:grid-cols-3">
          <Pillar icon={BookOpen} title="Zéro stress pour les cours" text="Retrouve cours, examens, TD et résumés partagés par les étudiants de ton département." tone="bg-[#eaf5fc] text-[#126cb1]" />
          <Pillar icon={Home} title="La vraie vie étudiante" text="Coloc, covoit, bons plans, cafés calmes et imprimeries à portée de clic." tone="bg-[#fff4df] text-[#d4840f]" />
          <Pillar icon={Trophy} title="Vivre l’ISET à fond" text="Découvre les clubs, les événements et rencontre les gens qui te ressemblent." tone="bg-[#e8f7f0] text-[#15915c]" />
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      {!user && (
        <section className="mx-auto mt-14 max-w-7xl px-4 sm:px-5 lg:px-8">
          <div className="hero-mesh relative overflow-hidden rounded-[2rem] px-6 py-10 text-center text-white sm:px-12 sm:py-14">
            <div className="hero-grid absolute inset-0 opacity-60" />
            <div className="relative">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Rejoins ta communauté ISET.</h2>
              <p className="mx-auto mt-3 max-w-xl text-blue-100">Compte gratuit avec ton email @iset.tn. Enregistre tes favoris, partage des documents et ne rate plus rien.</p>
              <button onClick={onSignup} className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-[#fba831] px-6 text-sm font-extrabold text-[#021d33] shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:brightness-105">
                Créer mon compte <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

/* ═════════ Sous-composants ═════════ */

function SectionTitle({ eyebrow, title, action, compact = false }: { eyebrow: string; title: string; action?: { label: string; onClick: () => void }; compact?: boolean }) {
  return (
    <div className={`flex items-end justify-between gap-4 ${compact ? 'mb-3' : 'mb-6'}`}>
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#126cb1]">{eyebrow}</p>
        <h2 className={`mt-1.5 font-extrabold tracking-tight ${compact ? 'text-xl' : 'text-2xl sm:text-3xl'}`}>{title}</h2>
      </div>
      {action && <button onClick={action.onClick} className="inline-flex shrink-0 items-center gap-1 text-sm font-extrabold text-[#126cb1]">{action.label} <ArrowRight size={15} /></button>}
    </div>
  );
}

function Pillar({ icon: Icon, title, text, tone }: { icon: LucideIcon; title: string; text: string; tone: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lift">
      <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}><Icon size={22} /></span>
      <h3 className="mt-5 text-lg font-extrabold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
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
    <div className="animate-float-in relative" style={{ animationDelay: '.1s' }}>
      <div className="absolute -inset-3 rounded-[2.25rem] bg-white/10 blur-2xl" />
      <div className="relative rounded-[2rem] border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-md">
        <div className="rounded-[1.5rem] bg-white p-5 text-[#021d33] shadow-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-extrabold capitalize tracking-wider text-slate-400"><Calendar size={13} /> {today}</p>
              <h3 className="mt-1 text-xl font-extrabold">{user ? `Ton espace, ${user.name.split(' ')[0]}` : 'Ton espace du jour'}</h3>
            </div>
            <button onClick={() => go('etudes')} className="flex items-center gap-1.5 rounded-full bg-[#fff4df] px-3 py-1.5 text-xs font-extrabold text-[#d4840f] transition hover:brightness-95">
              <Bookmark size={13} fill="currentColor" /> {savedCount}
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm font-extrabold">Mes rappels</p>
            <span className="text-xs font-bold text-slate-400">{todos.length === 0 ? 'Rien pour l’instant' : `${remaining} à faire`}</span>
          </div>

          <div className="mt-2 flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') add(); }}
              placeholder="Ex. rendre le TP de réseaux"
              aria-label="Ajouter un rappel"
              className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none transition focus:border-[#126cb1] focus:ring-4 focus:ring-[#126cb1]/10"
            />
            <button onClick={add} aria-label="Ajouter" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#126cb1] text-white transition hover:bg-[#0f5b96]"><Plus size={18} /></button>
          </div>

          <ul className="mt-3 space-y-1.5">
            {todos.slice(0, 4).map((todo) => (
              <li key={todo.id} className="group flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2">
                <button
                  onClick={() => setTodos((current) => current.map((item) => (item.id === todo.id ? { ...item, done: !item.done } : item)))}
                  aria-label={todo.done ? 'Marquer comme à faire' : 'Marquer comme fait'}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${todo.done ? 'border-[#15915c] bg-[#15915c] text-white' : 'border-slate-300'}`}
                >
                  {todo.done && <Check size={12} strokeWidth={3} />}
                </button>
                <span className={`min-w-0 flex-1 truncate text-sm font-semibold ${todo.done ? 'text-slate-400 line-through' : ''}`}>{todo.text}</span>
                <button onClick={() => setTodos((current) => current.filter((item) => item.id !== todo.id))} aria-label="Supprimer" className="text-slate-300 transition hover:text-red-500"><Trash2 size={14} /></button>
              </li>
            ))}
            {todos.length > 4 && <li className="px-1 text-xs font-bold text-slate-400">+ {todos.length - 4} autre{todos.length - 4 > 1 ? 's' : ''}</li>}
          </ul>

          {!user && (
            <button onClick={onSignup} className="mt-4 flex w-full items-center justify-between rounded-xl bg-[#e8f3fb] px-4 py-3 text-left text-sm font-extrabold text-[#126cb1] transition hover:brightness-95">
              Crée ton compte pour tout garder<ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
