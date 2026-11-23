export type MarketItem = {
  id: string;
  title: string;
  short: string;
  price: string;
  condition: string;
  seller: string;
  description: string;
  image: string;
};

export const marketItems: MarketItem[] = [
  {
    id: 'm1',
    title: 'Calculatrice CASIO fx-991CW',
    short: 'Parfaite pour les examens de maths et physique.',
    price: '55 DT',
    condition: 'Très bon état',
    seller: 'Yasmine B.',
    description: 'Calculatrice scientifique ClassWiz, modèle autorisé aux examens. Avec sa housse d’origine et le mode examen activable. Achetée l’an dernier, très peu servie.',
    image: 'https://images.pexels.com/photos/6238357/pexels-photo-6238357.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'm2',
    title: 'HP EliteBook 840 G5',
    short: 'i5 8e gén, 8 Go RAM, SSD 256 Go.',
    price: '750 DT',
    condition: 'Bon état',
    seller: 'Amine K.',
    description: 'Laptop solide et léger, idéal pour la programmation et la bureautique. Batterie tient environ 5 h. Windows 11 installé avec Visual Studio Code et Office.',
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'm3',
    title: 'Lot de 6 livres de gestion',
    short: 'Comptabilité, marketing, microéconomie.',
    price: '45 DT',
    condition: 'Bon état',
    seller: 'Nour J.',
    description: 'Les manuels principaux des S1 à S4 en gestion, annotés au crayon (effaçable). Un gain de temps énorme pour les révisions.',
    image: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'm4',
    title: 'Vélo VTT 26 pouces',
    short: 'Pour les trajets Midoun ↔ campus.',
    price: '180 DT',
    condition: 'État correct',
    seller: 'Sami R.',
    description: 'VTT 21 vitesses, freins révisés le mois dernier. Idéal pour éviter le bus le matin. Antivol inclus.',
    image: 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'm5',
    title: 'Casque bluetooth JBL Tune 510',
    short: 'Autonomie 40 h, micro intégré.',
    price: '65 DT',
    condition: 'Très bon état',
    seller: 'Mariem T.',
    description: 'Parfait pour les cours en ligne et le train. Mousse d’origine, aucune rayure. Boîte et câble de charge inclus.',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'm6',
    title: 'Blouse de TP + fauteuil roulant pliant',
    short: 'Matériel labo et mobilité.',
    price: '30 DT',
    condition: 'Bon état',
    seller: 'Karim S.',
    description: 'Lot de deux blouses taille L lavées, et un fauteuil roulant pliant très utile après l’opération du genou (plus besoin, je le donne à prix mini).',
    image: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];
