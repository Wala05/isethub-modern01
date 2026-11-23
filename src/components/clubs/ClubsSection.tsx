import type { NotifyFn } from '@/lib/types';
import { EmptyState } from '@/components/shared/EmptyState';

type Club = {
  id: string;
  name: string;
  category: string;
  members: string;
  nextEvent: string;
  eventDate: string;
  description: string;
};

const clubs: Club[] = [
  {
    id: 'c1',
    name: 'Club Informatique ISET',
    category: 'Technologie',
    members: '180 membres',
    nextEvent: 'Hackathon IsetHub — 48 h de code',
    eventDate: '12 décembre',
    description: 'Ateliers de programmation, veille techno et projets réels avec des entreprises locales.',
  },
  {
    id: 'c2',
    name: 'Club Robotique',
    category: 'Technologie',
    members: '95 membres',
    nextEvent: 'Démo de robots au hall principal',
    eventDate: '5 décembre',
    description: 'Conception, impression 3D et compétitions nationales de robotique.',
  },
  {
    id: 'c3',
    name: 'Club Théâtre & Arts',
    category: 'Culture',
    members: '60 membres',
    nextEvent: 'Scène ouverte — fin de semestre',
    eventDate: '20 décembre',
    description: 'Improvisation, court-métrage et exposés artistiques sur le campus.',
  },
  {
    id: 'c4',
    name: 'Club Sport & Aventure',
    category: 'Sport',
    members: '210 membres',
    nextEvent: 'Randonnée Guellala — coucher de soleil',
    eventDate: '14 décembre',
    description: 'Foot, basket, randonnées et sorties découverte de l’île.',
  },
  {
    id: 'c5',
    name: 'Club Environnement',
    category: 'Engagement',
    members: '70 membres',
    nextEvent: 'Nettoyage de la plage de Sidi Mehrez',
    eventDate: '8 décembre',
    description: 'Sensibilisation, recyclage sur le campus et actions citoyennes.',
  },
  {
    id: 'c6',
    name: 'Club Entrepreneuriat',
    category: 'Professionnel',
    members: '120 membres',
    nextEvent: 'Pitch night — présente ton idée en 3 min',
    eventDate: '18 décembre',
    description: 'Conférences avec des entrepreneurs djerbiens, coaching de projets et mises en relation.',
  },
];

export function ClubsSection({ notify }: { notify: NotifyFn }) {
  if (clubs.length === 0) return <EmptyState text="Aucun club pour le moment." />;

  return (
    <div>
      {clubs.map((club, index) => (
        <article key={club.id} className="group hairline grid gap-4 py-8 transition hover:bg-[var(--surface-2)] sm:px-5 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-10">
          <div className="flex items-baseline gap-5 lg:w-64 lg:flex-col lg:gap-2">
            <span className="index-tag transition group-hover:text-[var(--accent)]">/{String(index + 1).padStart(2, '0')}/</span>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[var(--accent)]">{club.category}</p>
              <h3 className="mt-1 text-xl font-extrabold tracking-tight">{club.name}</h3>
              <p className="index-tag mt-1">{club.members}</p>
            </div>
          </div>
          <p className="text-sm leading-6 text-[var(--ink-soft)]">{club.description}</p>
          <div className="border border-[var(--line)] p-5 lg:w-72">
            <p className="eyebrow">Prochaine activité</p>
            <p className="mt-2 text-sm font-extrabold leading-snug">{club.nextEvent}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-[var(--ink-faint)]">{club.eventDate}</span>
              <button onClick={() => notify('Ta demande d’inscription a été envoyée au club ' + club.name + '.')} className="btn btn-line !min-h-9 text-xs uppercase tracking-[.12em]">
                Rejoindre
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
