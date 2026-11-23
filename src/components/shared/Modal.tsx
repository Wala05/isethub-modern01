import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

type ModalProps = { title: string; onClose: () => void; children: ReactNode };

/** Sur mobile : s’ouvre comme un « bottom sheet » facile à atteindre au pouce. */
export function Modal({ title, onClose, children }: ModalProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[#021d33]/60 backdrop-blur-sm sm:items-center sm:p-5" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className="animate-sheet-up relative max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] bg-white p-6 shadow-2xl sm:max-w-md sm:rounded-[1.75rem]"
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-slate-200 sm:hidden" />
        <button onClick={onClose} aria-label="Fermer" className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
          <X size={18} />
        </button>
        <h2 className="pr-8 text-2xl font-extrabold tracking-tight">{title}</h2>
        {children}
      </div>
    </div>
  );
}
