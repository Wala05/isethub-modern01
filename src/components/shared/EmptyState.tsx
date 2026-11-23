import type { LucideIcon } from 'lucide-react';
import { SearchX } from 'lucide-react';

type EmptyStateProps = { text: string; icon?: LucideIcon; action?: { label: string; onClick: () => void } };

export function EmptyState({ text, icon: Icon = SearchX, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf5fc] text-[#126cb1]"><Icon size={24} /></div>
      <p className="mt-4 max-w-sm text-sm font-semibold text-slate-500">{text}</p>
      {action && (
        <button onClick={action.onClick} className="mt-5 rounded-xl bg-[#126cb1] px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#0f5b96]">
          {action.label}
        </button>
      )}
    </div>
  );
}
