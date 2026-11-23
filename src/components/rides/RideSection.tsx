import { useState } from 'react';
import { Car, Clock, MapPin, Plus } from 'lucide-react';
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
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-slate-500">{rides.length} trajet{rides.length > 1 ? 's' : ''} partagé{rides.length > 1 ? 's' : ''} cette semaine</p>
        <button onClick={() => setOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#fba831] px-4 text-sm font-extrabold text-[#021d33] shadow-sm transition hover:-translate-y-0.5 hover:brightness-105">
          <Plus size={16} /> Proposer un trajet
        </button>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {rides.map((ride) => (
          <article key={ride.id} className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lift sm:flex-row sm:items-center">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eaf5fc] text-[#126cb1]"><Car size={22} /></span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1"><MapPin size={12} /> {ride.from} → {ride.to}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {ride.when}</span>
              </div>
              <h3 className="mt-1.5 font-extrabold">{ride.driver}</h3>
              <p className="mt-1 text-xs font-semibold text-slate-400">{ride.seats} · {ride.price}</p>
            </div>
            <button onClick={() => notify('Réservation envoyée à ' + ride.driver + '. Il/elle te confirmera bientôt.')} className="shrink-0 rounded-xl bg-[#126cb1] px-4 py-2.5 text-xs font-extrabold text-white transition hover:bg-[#0f5b96]">
              Réserver
            </button>
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

  const inputClass = 'mt-3 h-12 w-full rounded-xl border border-slate-200 px-3.5 text-sm font-semibold outline-none transition focus:border-[#126cb1] focus:ring-4 focus:ring-[#126cb1]/10';

  return (
    <Modal title="Proposer un trajet" onClose={onClose}>
      <p className="mt-1 text-sm text-slate-500">Renseigne ton départ, ta destination et l’horaire. Les étudiants intéressés te contacteront.</p>
      <input autoFocus value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Départ (ex. Houmt Souk)" className={inputClass + ' mt-5'} />
      <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Destination" className={inputClass} />
      <input value={when} onChange={(e) => setWhen(e.target.value)} placeholder="Quand ? (ex. Lun → Ven, 7h15)" className={inputClass} />
      <div className="mt-6 flex justify-end gap-2">
        <button onClick={onClose} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-500 transition hover:bg-slate-50">Annuler</button>
        <button
          disabled={!from.trim() || !when.trim()}
          onClick={() => onSubmit(from.trim(), to.trim(), when.trim())}
          className="rounded-xl bg-[#126cb1] px-5 py-2.5 text-sm font-extrabold text-white shadow-md shadow-[#126cb1]/25 transition hover:bg-[#0f5b96] disabled:opacity-50"
        >
          Publier le trajet
        </button>
      </div>
    </Modal>
  );
}
