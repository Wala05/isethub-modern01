import { useMemo, useState } from 'react';
import { Home, MapPin, Search, X } from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import type { NotifyFn } from '@/lib/types';
import { EmptyState } from '@/components/shared/EmptyState';

type Housing = {
  id: string;
  title: string;
  area: string;
  rent: string;
  kind: string;
  available: string;
  perks: string[];
  description: string;
};

const housings: Housing[] = [
  {
    id: 'h1',
    title: 'Chambre meublée en colocation',
    area: 'Houmt Souk',
    rent: '220 DT / mois',
    kind: 'Chambre',
    available: 'Dès le 1er décembre',
    perks: ['Wi-Fi fibre', 'Climatisation', 'Cuisine partagée'],
    description: 'Appartement à 10 min du campus, partagé avec deux étudiantes en gestion. Charges et internet inclus.',
  },
  {
    id: 'h2',
    title: 'Studio indépendant',
    area: 'Midoun',
    rent: '350 DT / mois',
    kind: 'Studio',
    available: 'Dès maintenant',
    perks: ['Salle de bain privée', 'Terrasse', 'Parking'],
    description: 'Studio calme à 15 min du campus en bus. Idéal pour les révisions, commerces à deux pas.',
  },
  {
    id: 'h3',
    title: 'Colocation 3 chambres — 1 place libre',
    area: 'Djerba Ajim',
    rent: '180 DT / mois',
    kind: 'Place en colocation',
    available: 'Dès le 15 décembre',
    perks: ['Wi-Fi', 'Machine à laver', 'Proche du bus'],
    description: 'Ambiance studieuse et conviviale, colocs des départements IT et Électrique. Loyer le plus doux du groupe.',
  },
];

export function HousingSection({ notify }: { notify: NotifyFn }) {
  const [query, setQuery] = useState('');
  const [favs, setFavs] = useLocalStorage<string[]>('isethub-housing-favs', []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return housings;
    return housings.filter((housing) => `${housing.title} ${housing.area} ${housing.kind} ${housing.description}`.toLowerCase().includes(needle));
  }, [query]);

  const toggleFav = (id: string) => {
    const saved = favs.includes(id);
    setFavs((current) => (saved ? current.filter((item) => item !== id) : [...current, id]));
    notify(saved ? 'Retiré de tes favoris.' : 'Ajouté à tes favoris ⭐');
  };

  return (
    <div>
      <label className="mb-5 flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3.5 shadow-sm transition focus-within:border-[#126cb1] focus-within:ring-4 focus-within:ring-[#126cb1]/10">
        <Search size={18} className="shrink-0 text-slate-400" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Zone, type, mot-clé…" aria-label="Rechercher un logement" className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400" />
        {query && <button onClick={() => setQuery('')} aria-label="Effacer" className="text-slate-400 hover:text-slate-700"><X size={16} /></button>}
      </label>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((housing) => {
          const saved = favs.includes(housing.id);
          return (
            <article key={housing.id} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lift">
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff4df] text-[#d4840f]"><Home size={20} /></span>
                <strong className="rounded-xl bg-[#eaf5fc] px-3 py-1.5 text-sm font-extrabold text-[#126cb1]">{housing.rent}</strong>
              </div>
              <h3 className="mt-4 font-extrabold leading-snug">{housing.title}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-slate-400"><MapPin size={13} /> {housing.area} · {housing.kind}</p>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">{housing.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {housing.perks.map((perk) => <span key={perk} className="rounded-lg bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-500">{perk}</span>)}
              </div>
              <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
                <span className="text-xs font-bold text-slate-400">{housing.available}</span>
                <div className="flex gap-2">
                  <button onClick={() => toggleFav(housing.id)} aria-pressed={saved} aria-label={saved ? 'Retirer des favoris' : 'Ajouter aux favoris'} className={`rounded-xl border p-2.5 transition ${saved ? 'border-[#fba831] bg-[#fff4df] text-[#d4840f]' : 'border-slate-200 text-slate-500 hover:border-[#fba831] hover:text-[#d4840f]'}`}>★</button>
                  <button onClick={() => notify('Le propriétaire a reçu ta demande pour « ' + housing.title + ' ».')} className="rounded-xl bg-[#126cb1] px-3.5 py-2 text-xs font-extrabold text-white transition hover:bg-[#0f5b96]">Contacter</button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <EmptyState text="Aucun logement ne correspond à ta recherche." action={{ label: 'Effacer la recherche', onClick: () => setQuery('') }} />
      )}

      <p className="mt-6 text-center text-xs font-semibold text-slate-400">
        Tu as un logement à proposer&nbsp;?
        <button onClick={() => notify('Merci ! La publication d’annonce arrive très vite.')} className="ml-1 font-extrabold text-[#126cb1]">Publie ton annonce</button>
      </p>
    </div>
  );
}
