import { useMemo, useState } from 'react';
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
  image: string;
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
    image: 'https://images.pexels.com/photos/20725943/pexels-photo-20725943/free-photo-of-room-with-a-bed-and-a-desk-in-an-apartment.jpeg?h=600&w=900&fit=crop',
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
    image: 'https://images.pexels.com/photos/12148593/pexels-photo-12148593.jpeg?h=600&w=900&fit=crop',
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
    image: 'https://images.pexels.com/photos/32677196/pexels-photo-32677196/free-photo-of-cozy-bedroom-with-musical-and-natural-decor.jpeg?h=600&w=900&fit=crop',
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
      <label className="mb-2 flex h-12 items-center gap-3 border border-[var(--line)] bg-[var(--surface)] px-4 transition focus-within:border-[var(--accent)]">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Zone, type, mot-clé…" aria-label="Rechercher un logement" className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[var(--ink-faint)]" />
        {query && <button onClick={() => setQuery('')} aria-label="Effacer" className="index-tag transition hover:!text-[var(--accent)]">✕</button>}
      </label>
      <p className="index-tag mb-6">{filtered.length} logement{filtered.length > 1 ? 's' : ''}</p>

      <div>
        {filtered.map((housing, index) => {
          const saved = favs.includes(housing.id);
          return (
            <article key={housing.id} className="group hairline grid gap-4 py-7 transition hover:bg-[var(--surface-2)] sm:px-5 lg:grid-cols-[auto_auto_1fr_auto] lg:items-center lg:gap-8">
              <span className="index-tag hidden w-10 shrink-0 transition group-hover:text-[var(--accent)] lg:block">/{String(index + 1).padStart(2, '0')}/</span>
              <img src={housing.image} alt={housing.title} loading="lazy" className="h-40 w-full border border-[var(--line)] object-cover lg:h-32 lg:w-48" />
              <div className="flex items-baseline gap-5 lg:flex-col lg:items-start lg:gap-2">
                <span className="index-tag transition group-hover:text-[var(--accent)] lg:hidden">/{String(index + 1).padStart(2, '0')}/</span>
                <div>
                  <h3 className="text-xl font-extrabold leading-snug tracking-tight">{housing.title}</h3>
                  <p className="index-tag mt-1 uppercase">{housing.area} · {housing.kind}</p>
                </div>
              </div>
              <div>
                <p className="text-sm leading-6 text-[var(--ink-soft)]">{housing.description}</p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                  {housing.perks.map((perk) => <span key={perk} className="index-tag">{perk}</span>)}
                </div>
              </div>
              <div className="flex flex-col items-start gap-3 border border-[var(--line)] p-5 lg:w-60 lg:items-stretch">
                <strong className="text-lg font-extrabold tracking-tight">{housing.rent}</strong>
                <span className="index-tag">{housing.available}</span>
                <div className="flex items-center justify-between gap-3">
                  <button onClick={() => toggleFav(housing.id)} aria-pressed={saved} aria-label={saved ? 'Retirer des favoris' : 'Ajouter aux favoris'} className={`text-lg leading-none transition ${saved ? 'text-[var(--accent)]' : 'text-[var(--ink-faint)] hover:text-[var(--accent)]'}`}>★</button>
                  <button onClick={() => notify('Le propriétaire a reçu ta demande pour « ' + housing.title + ' ».')} className="btn btn-line !min-h-9 text-xs uppercase tracking-[.12em]">Contacter</button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <EmptyState text="Aucun logement ne correspond à ta recherche." action={{ label: 'Effacer la recherche', onClick: () => setQuery('') }} />
      )}

      <div className="hairline mt-6 pt-6 text-center">
        <p className="text-sm font-semibold text-[var(--ink-soft)]">
          Tu as un logement à proposer&nbsp;?
          <button onClick={() => notify('Merci ! La publication d’annonce arrive très vite.')} className="link-underline ml-2 font-extrabold">Publie ton annonce</button>
        </p>
      </div>
    </div>
  );
}
