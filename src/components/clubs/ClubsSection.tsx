import { Trophy, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
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
  tone: string;
  icon: LucideIcon;
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
    tone: 'bg-[#eaf5fc] text-[#126cb1]',
    icon: Trophy,
  },
  {
    id: 'c2',
    name: 'Club Robotique',
    category: 'Technologie',
    members: '95 membres',
    nextEvent: 'Démo de robots au hall principal',
    eventDate: '5 décembre',
    description: 'Conception, impression 3D et compétitions nationales de robotique.',
    tone: 'bg-[#eaf5fc] text-[#126cb1]',
    icon: Trophy,
  },
  {
    id: 'c3',
    name: 'Club Théâtre & Arts',
    category: 'Culture',
    members: '60 membres',
    nextEvent: 'Scène ouverte — fin de semestre',
    eventDate: '20 décembre',
    description: 'Improvisation, court-métrage et exposés artistiques sur le campus.',
    tone: 'bg-[#fff4df] text-[#d4840f]',
    icon: Users,
  },
  {
    id: 'c4',
    name: 'Club Sport & Aventure',
    category: 'Sport',
    members: '210 membres',
    nextEvent: 'Randonnée Guellala — coucher de soleil',
    eventDate: '14 décembre',
    description: 'Foot, basket, randonnées et sorties découverte de l’île.',
    tone: 'bg-[#e8f7f0] text-[#15915c]',
    icon: Trophy,
  },
  {
    id: 'c5',
    name: 'Club Environnement',
    category: 'Engagement',
    members: '70 membres',
    nextEvent: 'Nettoyage de la plage de Sidi Mehrez',
    eventDate: '8 décembre',
    description: 'Sensibilisation, recyclage sur le campus et actions citoyennes.',
    tone: 'bg-[#e8f7f0] text-[#15915c]',
    icon: Users,
  },
  {
    id: 'c6',
    name: 'Club Entrepreneuriat',
    category: 'Professionnel',
    members: '120 membres',
    nextEvent: 'Pitch night — présente ton idée en 3 min',
    eventDate: '18 décembre',
    description: 'Conférences avec des entrepreneurs djerbiens, coaching de projets et mises en relation.',
    tone: 'bg-[#fff4df] text-[#d4840f]',
    icon: Trophy,
  },
];

export function ClubsSection({ notify }: { notify: NotifyFn }) {
  if (clubs.length === 0) return <EmptyState text="Aucun club pour le moment." />;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {clubs.map((club) => {
        const Icon = club.icon;
        return (
          <article key={club.id} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lift">
            <div className="flex items-start gap-4">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${club.tone}`}><Icon size={22} /></span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-[#eef7fd] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#126cb1]">{club.category}</span>
                  <span className="text-xs font-bold text-slate-400">{club.members}</span>
                </div>
                <h3 className="mt-1.5 font-extrabold leading-snug">{club.name}</h3>
              </div>
            </div>
            <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">{club.description}</p>
            <div className="mt-4 rounded-2xl bg-slate-50 p-3.5">
              <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-slate-400">Prochaine activité</p>
              <p className="mt-1 text-sm font-extrabold">{club.nextEvent}</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#d4840f]">{club.eventDate}</span>
                <button onClick={() => notify('Ta demande d’inscription a été envoyée au club ' + club.name + '.')} className="rounded-xl bg-[#126cb1] px-3.5 py-2 text-xs font-extrabold text-white transition hover:bg-[#0f5b96]">
                  Rejoindre
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
