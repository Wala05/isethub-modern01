import { navItems } from '@/lib/nav';
import type { View } from '@/lib/types';
import { Logo } from './Logo';

type FooterProps = { go: (view: View) => void; openAuth: () => void; notify: (message: string) => void };

export function Footer({ go, openAuth, notify }: FooterProps) {
  return (
    <footer className="bg-[#101820] text-[#c8d0d8] pb-20 lg:pb-0">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
        <div>
          <button onClick={() => go('accueil')}><Logo light /></button>
          <p className="mt-5 max-w-xs text-sm leading-6 text-[#c8d0d8]/70">
            Le point de rencontre des études et de la vie à l’ISET Djerba.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#c8d0d8]/50">Explorer</p>
          <div className="mt-5 space-y-3 text-sm font-semibold">
            {navItems.filter((item) => item.key !== 'accueil').map((item, index) => (
              <button key={item.key} onClick={() => go(item.key)} className="block transition hover:text-white">
                <span className="mr-2 text-[10px] font-bold text-[#c8d0d8]/40">/{String(index + 2).padStart(2, '0')}/</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#c8d0d8]/50">À connaître</p>
          <div className="mt-5 space-y-3 text-sm font-semibold">
            <button onClick={openAuth} className="block transition hover:text-white">Accès étudiant</button>
            <button onClick={() => notify('La politique de confidentialité sera bientôt disponible.')} className="block transition hover:text-white">Confidentialité</button>
            <button onClick={() => notify('Les conditions d’utilisation seront bientôt disponibles.')} className="block transition hover:text-white">Conditions d’utilisation</button>
          </div>
        </div>
        <div className="border border-white/15 p-6">
          <p className="text-sm font-bold leading-6 text-white">IsetHub est une initiative étudiante indépendante.</p>
          <p className="mt-2 text-sm leading-6 text-[#c8d0d8]/70">Pour toute information administrative, consulte ton ISET.</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-1 py-5 text-xs font-semibold text-[#c8d0d8]/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 IsetHub. Tous droits réservés.</span>
          <span>Fait avec ♥ pour les étudiants ISET Djerba</span>
        </div>
      </div>
    </footer>
  );
}
