import { BookOpen, Compass, Home, ShoppingBag, Users, type LucideIcon } from 'lucide-react';
import type { View } from './types';

export const navItems: { key: View; label: string; short: string; icon: LucideIcon }[] = [
  { key: 'accueil', label: 'Accueil', short: 'Accueil', icon: Home },
  { key: 'etudes', label: 'Études', short: 'Études', icon: BookOpen },
  { key: 'vie', label: 'Vie étudiante', short: 'Vie', icon: Compass },
  { key: 'clubs', label: 'Clubs & events', short: 'Clubs', icon: Users },
  { key: 'marketplace', label: 'Marketplace', short: 'Market', icon: ShoppingBag },
];

export const validViews = navItems.map((item) => item.key);

export function viewFromHash(): View {
  const hash = window.location.hash.replace('#', '') as View;
  return validViews.includes(hash) ? hash : 'accueil';
}
