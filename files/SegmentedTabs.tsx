import type { LucideIcon } from 'lucide-react';

type Tab<K extends string> = { key: K; label: string; icon?: LucideIcon };
type SegmentedTabsProps<K extends string> = { tabs: readonly Tab<K>[]; value: K; onChange: (key: K) => void };

export function SegmentedTabs<K extends string>({ tabs, value, onChange }: SegmentedTabsProps<K>) {
  return (
    <div className="no-scrollbar mb-6 flex gap-1.5 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm" role="tablist">
      {tabs.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          role="tab"
          aria-selected={value === key}
          onClick={() => onChange(key)}
          className={`flex min-w-fit flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-3 text-sm font-bold transition ${
            value === key ? 'bg-[#126cb1] text-white shadow-md shadow-[#126cb1]/25' : 'text-slate-500 hover:bg-slate-50 hover:text-[#126cb1]'
          }`}
        >
          {Icon && <Icon size={17} />}
          {label}
        </button>
      ))}
    </div>
  );
}
