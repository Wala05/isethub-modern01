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
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/55 backdrop-blur-sm sm:items-center sm:p-5" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className="animate-sheet-up relative max-h-[92vh] w-full overflow-y-auto border border-[var(--line)] bg-[var(--surface)] p-6 shadow-2xl sm:max-w-md"
      >
        <button onClick={onClose} aria-label="Fermer" className="absolute right-4 top-4 p-2 text-[var(--ink-faint)] transition hover:text-[var(--ink)]">
          <X size={18} />
        </button>
        <p className="index-tag">/01/</p>
        <h2 className="mt-2 pr-8 text-2xl font-extrabold tracking-tight">{title}</h2>
        {children}
      </div>
    </div>
  );
}
