# IsetHub — refonte UX/UI

## Ce qui a changé
- **Navigation mobile** : barre d’onglets fixe en bas (Accueil, Études, Vie, Clubs, Market) au lieu du menu hamburger.
- **Recherche globale (⌘K / Ctrl+K)** : palette de commandes qui mène aux pages, aux raccourcis (examens, coloc, covoit…) et aux ressources.
- **Accueil** : hero moderne, grille d’accès rapide (8 raccourcis qui ouvrent directement le bon onglet), « Ton espace du jour » avec date, rappels perso et favoris.
- **Études** : recherche texte, filtre « Favoris », vote réversible, états de chargement, bouton « Réinitialiser ».
- **Marketplace** : recherche d’objets, cartes avec prix en badge.
- **Mode sombre** (bouton lune/soleil dans le header, mémorisé, respecte le thème du téléphone).
- **Modales en « bottom sheet »** sur mobile, fermeture avec Échap.
- **URL avec #** : le bouton retour du navigateur fonctionne (`/#etudes`, `/#vie`…).
- Police Plus Jakarta Sans, couleurs/ombres/animations unifiées dans `src/index.css`.

## Structure du code
`App.tsx` était un seul fichier de ~125 lignes très denses ; il est maintenant découpé :
`src/pages/*` (Accueil, Études, Vie, Clubs, Marketplace), `src/components/layout/*` (Header, BottomNav, Footer, CommandPalette),
`src/components/shared/*` (Modal, Tabs, PageShell…), `src/lib/*` (hooks, types, ressources).

## À lancer
```bash
npm install
npm run dev
```
Les composants existants (clubs, logement, covoiturage, food, bons plans) n’ont pas été modifiés : ils héritent du nouveau thème et du mode sombre via `src/index.css`.
