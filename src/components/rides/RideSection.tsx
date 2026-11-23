import { useState } from 'react';
import type { NotifyFn } from '@/lib/types';
import { Modal } from '@/components/shared/Modal';

type Ride = {
  id: string;
  driver: string;
  from: string;
  to: string;
  when: string;
  seats: string;
  price: string;
};

const rides: Ride[] = [
  { id: 'r1', driver: 'Amine K.', from: 'Houmt Souk', to: 'Campus ISET', when: 'Lun → Ven, 7h15', seats: '2 places', price: '1 DT / trajet' },
  { id: 'r2', driver: 'Sami R.', from: 'Midoun', to: 'Campus ISET', when: 'Lun, Mar, Jeu, 7h30', seats: '3 places', price: 'Gratuit (entraide)' },
  { id: 'r3', driver: 'Mariem T.', from: 'Campus ISET', to: 'Djerba Ajim', when: 'Lun → Ven, 17h45', seats: '1 place', price: '1 DT / trajet' },
  { id: 'r4', driver: 'Karim S.', from: 'Houmt Souk', to: 'Campus ISET', when: 'Mer, 8h00', seats: '2 places', price: '0.500 DT' },
];

export function RideSection({ notify }: { notify: NotifyFn }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="hairline mb-2 flex items-center justify-between gap-3 pt-6">
        <p className="index-tag">{rides.length} trajets partagés cette semaine</p>
        <button onClick={() => setOpen(true)} className="btn btn-primary shrink-0 !min-h-11 px-4 text-xs uppercase tracking-[.1em]">
          + Proposer un trajet
        </button>
      </div>

      <div>
        {rides.map((ride, index) => (
          <article key={ride.id} className="group hairline flex flex-col gap-4 py-6 transition hover:bg-[var(--surface-2)] sm:flex-row sm:items-center sm:gap-6 sm:px-5">
            <span className="index-tag w-10 shrink-0 transition group-hover:text-[var(--accent)]">/{String(index + 1).padStart(2, '0')}/</span>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-extrabold tracking-tight">{ride.from} → {ride.to}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[.12em] text-[var(--ink-faint)]">{ride.when}</p>
            </div>
            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <div className="text-left sm:text-right">
                <p className="text-sm font-extrabold">{ride.driver}</p>
                <p className="index-tag">{ride.seats} · {ride.price}</p>
              </div>
              <button onClick={() => notify('Réservation envoyée à ' + ride.driver + '. Il/elle te confirmera bientôt.')} className="btn btn-ghost shrink-0 !min-h-10 px-4 text-xs uppercase tracking-[.1em]">
                Réserver
              </button>
            </div>
          </article>
        ))}
      </div>

      {open && (
        <RideModal
          onClose={() => setOpen(false)}
          onSubmit={(from, to, when) => {
            setOpen(false);
            notify('Ton trajet ' + from + ' → ' + to + ' (' + when + ') a été proposé. Merci !');
          }}
        />
      )}
    </div>
  );
}

type RideModalProps = { onClose: () => void; onSubmit: (from: string, to: string, when: string) => void };

function RideModal({ onClose, onSubmit }: RideModalProps) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('Campus ISET');
  const [when, setWhen] = useState('');

  const inputClass = 'mt-4 h-12 w-full border border-[var(--line)] px-3.5 text-sm font-semibold outline-none transition focus:border-[var(--accent)]';

  return (
    <Modal title="Proposer un trajet" onClose={onClose}>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">Renseigne ton départ, ta destination et l’horaire. Les étudiants intéressés te contacteront.</p>
      <input autoFocus value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Départ (ex. Houmt Souk)" className={inputClass + ' !mt-6'} />
      <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Destination" className={inputClass} />
      <input value={when} onChange={(e) => setWhen(e.target.value)} placeholder="Quand ? (ex. Lun → Ven, 7h15)" className={inputClass} />
      <div className="mt-7 flex justify-end gap-3">
        <button onClick={onClose} className="btn btn-ghost !min-h-11 text-xs uppercase tracking-[.1em]">Annuler</button>
        <button
          disabled={!from.trim() || !when.trim()}
          onClick={() => onSubmit(from.trim(), to.trim(), when.trim())}
          className="btn btn-primary !min-h-11 text-xs uppercase tracking-[.1em]"
        >
          Publier le trajet
        </button>
      </div>
    </Modal>
  );
}
