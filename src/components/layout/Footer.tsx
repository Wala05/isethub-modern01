import { navItems } from '@/lib/nav';
import type { View } from '@/lib/types';
import { Logo } from './Logo';

type FooterProps = { go: (view: View) => void; openAuth: () => void; notify: (message: string) => void };

export function Footer({ go, openAuth, notify }: FooterProps) {
  return (
    <footer className="bg-[#021d33] pb-20 text-blue-100 lg:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:px-8">
        <div>
          <button onClick={() => go('accueil')} className="text-left"><Logo light /></button>
          <p className="mt-5 max-w-xs text-sm leading-6 text-blue-200/80">Le point de rencontre des études et de la vie à l’ISET Djerba.</p>
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#fba831]">Explorer</p>
          <div className="mt-4 space-y-2.5 text-sm font-semibold">
            {navItems.filter((item) => item.key !== 'accueil').map((item) => (
              <button key={item.key} onClick={() => go(item.key)} className="block transition hover:text-white">{item.label}</button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#fba831]">À connaître</p>
          <div className="mt-4 space-y-2.5 text-sm font-semibold">
            <button onClick={openAuth} className="block transition hover:text-white">Accès étudiant</button>
            <button onClick={() => notify('La politique de confidentialité sera bientôt disponible.')} className="block transition hover:text-white">Confidentialité</button>
            <button onClick={() => notify('Les conditions d’utilisation seront bientôt disponibles.')} className="block transition hover:text-white">Conditions d’utilisation</button>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm font-bold leading-6 text-white">IsetHub est une initiative étudiante indépendante.</p>
          <p className="mt-2 text-sm leading-6 text-blue-200/70">Pour toute information administrative, consulte ton ISET.</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-5 text-xs font-semibold text-blue-200/60 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>© 2026 IsetHub. Tous droits réservés.</span>
          <span>Fait avec ♥ pour les étudiants ISET Djerba</span>
        </div>
      </div>
    </footer>
  );
}
