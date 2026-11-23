type Deal = { id: string; name: string; category: string; text: string; meta: string };

const deals: Deal[] = [
  { id: 'd1', name: 'Café El Bahri', category: 'Café d’étude', text: 'Café calme, prises partout, -10% étudiants', meta: 'Houmt Souk · 1.2 km' },
  { id: 'd2', name: 'Mamma Mia', category: 'Resto', text: 'Plat du jour étudiant à 8 DT', meta: 'Midoun · 2.4 km' },
  { id: 'd3', name: 'Copy Center ISET', category: 'Impression', text: 'Impression couleur à partir de 0.400 DT', meta: 'À côté du campus' },
  { id: 'd4', name: 'Librairie El Fanar', category: 'Fournitures', text: '-15% sur les fournitures avec ta carte étudiante', meta: 'Houmt Souk · 1.8 km' },
  { id: 'd5', name: 'Station Agil Midoun', category: 'Transport', text: 'Gonflage et vérification pneus gratuits', meta: 'Midoun · 2.6 km' },
  { id: 'd6', name: 'Snack Chez Ali', category: 'Resto', text: 'Sandwich + boisson à 6 DT le midi', meta: 'Djerba Ajim · 3.1 km' },
];

export function DealsHub() {
  return (
    <div>
      <p className="index-tag mb-2">{deals.length} bons plans autour du campus</p>
      <div>
        {deals.map((deal, index) => (
          <article key={deal.id} className="group hairline grid gap-3 py-6 transition hover:bg-[var(--surface-2)] sm:grid-cols-[auto_1fr_auto] sm:items-baseline sm:gap-8 sm:px-5">
            <span className="index-tag transition group-hover:text-[var(--accent)]">/{String(index + 1).padStart(2, '0')}/</span>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[var(--accent)]">{deal.category}</p>
              <h3 className="mt-1 text-xl font-extrabold tracking-tight">{deal.name}</h3>
              <p className="mt-1.5 text-sm leading-6 text-[var(--ink-soft)]">{deal.text}</p>
            </div>
            <span className="index-tag">{deal.meta}</span>
          </article>
        ))}
      </div>
      <div className="hairline mt-6 pt-6 text-center">
        <p className="text-sm font-semibold text-[var(--ink-soft)]">
          Tu connais un bon plan&nbsp;?
          <span className="ml-2 font-extrabold text-[var(--ink)]">Partage-le à la communauté</span>
        </p>
      </div>
    </div>
  );
}
