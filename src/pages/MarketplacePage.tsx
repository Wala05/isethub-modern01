import { useMemo, useState } from 'react';
import { ArrowRight, CircleHelp, MessageCircle, Package, Plus, Search, Send, X } from 'lucide-react';
import { marketItems, type MarketItem } from '@/lib/market';
import type { NotifyFn } from '@/lib/types';
import { PageShell } from '@/components/shared/PageShell';
import { SegmentedTabs } from '@/components/shared/SegmentedTabs';
import { EmptyState } from '@/components/shared/EmptyState';

type MarketTab = 'shop' | 'forum';
const tabs = [
  { key: 'shop', label: 'Acheter / Vendre', icon: Package },
  { key: 'forum', label: 'Forum entraide', icon: MessageCircle },
] as const;

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function MarketplacePage({ notify, initialTab }: { notify: NotifyFn; initialTab?: string }) {
  const [tab, setTab] = useState<MarketTab>(initialTab === 'forum' ? 'forum' : 'shop');
  const [selected, setSelected] = useState<MarketItem | null>(null);
  const [query, setQuery] = useState('');

  const items = useMemo(() => {
    const needle = normalize(query.trim());
    return needle ? marketItems.filter((item) => normalize(`${item.title} ${item.short} ${item.seller}`).includes(needle)) : marketItems;
  }, [query]);

  return (
    <>
      <PageShell eyebrow="Marketplace & entraide" title="Acheter, vendre, s’entraider." intro="Tout ce qui peut te servir pendant tes années ISET, partagé par ta communauté.">
        <SegmentedTabs tabs={tabs} value={tab} onChange={setTab} />

        {tab === 'shop' ? (
          <>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row">
              <label className="flex h-12 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3.5 shadow-sm transition focus-within:border-[#126cb1] focus-within:ring-4 focus-within:ring-[#126cb1]/10">
                <Search size={18} className="shrink-0 text-slate-400" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Calculatrice, livre, laptop…" aria-label="Rechercher un objet" className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400" />
              </label>
              <button onClick={() => notify('Le formulaire d’annonce est prêt.')} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#fba831] px-5 text-sm font-extrabold text-[#021d33] shadow-sm transition hover:-translate-y-0.5 hover:brightness-105">
                <Plus size={17} /> Vendre un objet
              </button>
            </div>

            {items.length === 0 ? (
              <EmptyState text="Aucun objet ne correspond à ta recherche." action={{ label: 'Effacer la recherche', onClick: () => setQuery('') }} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <article key={item.id} className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lift">
                    <button onClick={() => setSelected(item)} className="relative aspect-[4/3] overflow-hidden bg-slate-100 text-left" aria-label={`Voir ${item.title}`}>
                      <img src={item.image} alt={item.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-sm font-extrabold text-[#126cb1] shadow">{item.price}</span>
                    </button>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-extrabold leading-snug">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{item.short}</p>
                      <div className="mt-auto flex items-center justify-between gap-2 pt-5">
                        <span className="truncate text-xs font-bold text-slate-400">Par {item.seller}</span>
                        <div className="flex shrink-0 gap-2">
                          <button onClick={() => setSelected(item)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-extrabold text-slate-600 transition hover:border-[#126cb1] hover:text-[#126cb1]">Voir plus</button>
                          <button onClick={() => notify('Message envoyé au vendeur.')} className="rounded-xl bg-[#126cb1] px-3 py-2 text-xs font-extrabold text-white transition hover:bg-[#0f5b96]">Contacter</button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
            <div className="space-y-3">
              <ForumCard title="Comment organiser mes révisions avant les partiels ?" tag="Méthodes de travail" replies="12 réponses" notify={notify} />
              <ForumCard title="Je me sens dépassé par le rythme, des conseils ?" tag="Bien-être étudiant" replies="8 réponses" notify={notify} />
              <ForumCard title="Quel laptop pour la filière IT avec un petit budget ?" tag="Matériel" replies="21 réponses" notify={notify} />
            </div>
            <div className="h-fit rounded-3xl bg-gradient-to-br from-[#021d33] to-[#0a4f80] p-6 text-white shadow-lift lg:sticky lg:top-24">
              <CircleHelp size={26} className="text-[#fba831]" />
              <h3 className="mt-5 text-xl font-extrabold">Une question en tête ?</h3>
              <p className="mt-2 text-sm leading-6 text-blue-100">Pose-la anonymement. La communauté IsetHub est là pour répondre sans jugement.</p>
              <button onClick={() => notify('Ton espace de question est prêt.')} className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#fba831] px-4 text-sm font-extrabold text-[#021d33] transition hover:brightness-105">
                <Send size={16} /> Poser une question
              </button>
            </div>
          </div>
        )}
      </PageShell>
      {selected && <MarketItemDialog item={selected} onClose={() => setSelected(null)} notify={notify} />}
    </>
  );
}

function ForumCard({ title, tag, replies, notify }: { title: string; tag: string; replies: string; notify: NotifyFn }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-center justify-between">
        <span className="rounded-md bg-[#e8f7f0] px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#15915c]">{tag}</span>
        <span className="text-xs font-bold text-slate-400">{replies}</span>
      </div>
      <h3 className="mt-4 font-extrabold leading-snug">{title}</h3>
      <div className="mt-5 flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs font-bold text-slate-400"><span className="h-6 w-6 rounded-full bg-orange-200" /> Anonyme · il y a 2h</span>
        <button onClick={() => notify('Discussion ouverte.')} className="inline-flex items-center gap-1 text-sm font-extrabold text-[#126cb1]">Répondre <ArrowRight size={14} /></button>
      </div>
    </article>
  );
}

function MarketItemDialog({ item, onClose, notify }: { item: MarketItem; onClose: () => void; notify: NotifyFn }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-5" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={item.title} className="animate-sheet-up relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:max-w-lg sm:rounded-[1.75rem]" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Fermer" className="absolute right-4 top-4 z-10 rounded-xl bg-white/90 p-2 text-slate-500 shadow transition hover:bg-white hover:text-slate-800"><X size={18} /></button>
        <div className="aspect-[16/10] shrink-0 overflow-hidden bg-slate-100"><img src={item.image} alt={item.title} className="h-full w-full object-cover" /></div>
        <div className="overflow-y-auto p-6">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-2xl font-extrabold leading-snug tracking-tight">{item.title}</h2>
            <strong className="shrink-0 rounded-xl bg-[#eaf5fc] px-3 py-1.5 text-lg font-extrabold text-[#126cb1]">{item.price}</strong>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="rounded-lg bg-[#e8f7f0] px-2.5 py-1.5 text-[#15915c]">État : {item.condition}</span>
            <span className="rounded-lg bg-[#fff4df] px-2.5 py-1.5 text-[#d4840f]">Vendu par {item.seller}</span>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-600">{item.description}</p>
          <button onClick={() => { notify('Message envoyé au vendeur.'); onClose(); }} className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#126cb1] px-4 text-sm font-extrabold text-white shadow-lg shadow-[#126cb1]/25 transition hover:bg-[#0f5b96]">
            <Send size={16} /> Contacter {item.seller}
          </button>
        </div>
      </div>
    </div>
  );
}
