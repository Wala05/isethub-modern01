type Deal = { id: string; name: string; category: string; text: string; meta: string; image: string };

const deals: Deal[] = [
  { id: 'd1', name: 'Café El Bahri', category: 'Café d’étude', text: 'Café calme, prises partout, -10% étudiants', meta: 'Houmt Souk · 1.2 km', image: 'https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg?h=600&w=900&fit=crop' },
  { id: 'd2', name: 'Mamma Mia', category: 'Resto', text: 'Plat du jour étudiant à 8 DT', meta: 'Midoun · 2.4 km', image: 'https://images.pexels.com/photos/28915289/pexels-photo-28915289/free-photo-of-cozy-restaurant-meal-with-potatoes-and-drink.jpeg?h=600&w=900&fit=crop' },
  { id: 'd3', name: 'Copy Center ISET', category: 'Impression', text: 'Impression couleur à partir de 0.400 DT', meta: 'À côté du campus', image: 'https://images.pexels.com/photos/13198554/pexels-photo-13198554.jpeg?h=600&w=900&fit=crop' },
  { id: 'd4', name: 'Librairie El Fanar', category: 'Fournitures', text: '-15% sur les fournitures avec ta carte étudiante', meta: 'Houmt Souk · 1.8 km', image: 'https://images.pexels.com/photos/38926004/pexels-photo-38926004/free-photo-of-cozy-bookstore-interior-with-shelves-and-books.jpeg?h=600&w=900&fit=crop' },
  { id: 'd5', name: 'Station Agil Midoun', category: 'Transport', text: 'Gonflage et vérification pneus gratuits', meta: 'Midoun · 2.6 km', image: 'https://images.pexels.com/photos/9180394/pexels-photo-9180394.jpeg?h=600&w=900&fit=crop' },
  { id: 'd6', name: 'Snack Chez Ali', category: 'Resto', text: 'Sandwich + boisson à 6 DT le midi', meta: 'Djerba Ajim · 3.1 km', image: 'https://images.pexels.com/photos/13591747/pexels-photo-13591747.jpeg?h=600&w=900&fit=crop' },
];

export function DealsHub() {
  return (
    <div>
      <p className="index-tag mb-2">{deals.length} bons plans autour du campus</p>
      <div>
        {deals.map((deal, index) => (
          <article key={deal.id} className="group hairline grid gap-4 py-6 transition hover:bg-[var(--surface-2)] sm:grid-cols-[auto_auto_1fr_auto] sm:items-center sm:gap-6 sm:px-5">
            <span className="index-tag hidden w-10 shrink-0 transition group-hover:text-[var(--accent)] sm:block">/{String(index + 1).padStart(2, '0')}/</span>
            <img src={deal.image} alt={deal.name} loading="lazy" className="h-32 w-full border border-[var(--line)] object-cover sm:h-24 sm:w-36" />
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[var(--accent)]">{deal.category}</p>
              <h3 className="mt-1 text-xl font-extrabold tracking-tight">{deal.name}</h3>
              <p className="mt-1.5 text-sm leading-6 text-[var(--ink-soft)]">{deal.text}</p>
            </div>
            <span className="index-tag hidden sm:block">{deal.meta}</span>
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
