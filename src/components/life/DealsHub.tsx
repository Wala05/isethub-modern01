import { Navigation, Printer, Store, Utensils, type LucideIcon } from 'lucide-react';

type Deal = { id: string; name: string; category: string; text: string; meta: string; tone: string; icon: LucideIcon };

const deals: Deal[] = [
  { id: 'd1', name: 'Café El Bahri', category: 'Café d’étude', text: 'Café calme, prises partout, -10% étudiants', meta: 'Houmt Souk · 1.2 km', tone: 'bg-[#fff4df] text-[#d4840f]', icon: Utensils },
  { id: 'd2', name: 'Mamma Mia', category: 'Resto', text: 'Plat du jour étudiant à 8 DT', meta: 'Midoun · 2.4 km', tone: 'bg-[#eaf5fc] text-[#126cb1]', icon: Utensils },
  { id: 'd3', name: 'Copy Center ISET', category: 'Impression', text: 'Impression couleur à partir de 0.400 DT', meta: 'À côté du campus', tone: 'bg-[#e8f7f0] text-[#15915c]', icon: Printer },
  { id: 'd4', name: 'Librairie El Fanar', category: 'Fournitures', text: '-15% sur les fournitures avec ta carte étudiante', meta: 'Houmt Souk · 1.8 km', tone: 'bg-[#fff4df] text-[#d4840f]', icon: Store },
  { id: 'd5', name: 'Station Agil Midoun', category: 'Transport', text: 'Gonflage et vérification pneus gratuits', meta: 'Midoun · 2.6 km', tone: 'bg-[#eaf5fc] text-[#126cb1]', icon: Navigation },
  { id: 'd6', name: 'Snack Chez Ali', category: 'Resto', text: 'Sandwich + boisson à 6 DT le midi', meta: 'Djerba Ajim · 3.1 km', tone: 'bg-[#e8f7f0] text-[#15915c]', icon: Utensils },
];

export function DealsHub() {
  const categories = ['Tout', ...Array.from(new Set(deals.map((deal) => deal.category)))];

  return (
    <div>
      <p className="mb-4 text-sm font-bold text-slate-500">{deals.length} bons plans autour du campus</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {deals.map((deal) => {
          const Icon = deal.icon;
          return (
            <article key={deal.id} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lift">
              <div className="flex items-start justify-between gap-3">
                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${deal.tone}`}><Icon size={20} /></span>
                <span className="rounded-md bg-[#eef7fd] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#126cb1]">{deal.category}</span>
              </div>
              <h3 className="mt-4 font-extrabold leading-snug">{deal.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">{deal.text}</p>
              <p className="mt-3 text-xs font-bold text-slate-400">{deal.meta}</p>
            </article>
          );
        })}
      </div>
      <p className="mt-6 text-center text-xs font-semibold text-slate-400">
        Tu connais un bon plan&nbsp;? {categories[0] === 'Tout' && 'Partage-le'}
        <button onClick={() => document.dispatchEvent(new CustomEvent('notify-demo'))} className="ml-1 font-extrabold text-[#126cb1]">Suggère-le à la communauté</button>
      </p>
    </div>
  );
}
