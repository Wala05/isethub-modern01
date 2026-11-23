import type { LucideIcon } from 'lucide-react';

type Tab<K extends string> = { key: K; label: string; icon?: LucideIcon };
type SegmentedTabsProps<K extends string> = { tabs: readonly Tab<K>[]; value: K; onChange: (key: K) => void };

export function SegmentedTabs<K extends string>({ tabs, value, onChange }: SegmentedTabsProps<K>) {
  return (
    <div className="no-scrollbar hairline mb-10 flex gap-6 overflow-x-auto" role="tablist">
      {tabs.map(({ key, label, icon: _icon }, index) => (
        <button
          key={key}
          role="tab"
          aria-selected={value === key}
          onClick={() => onChange(key)}
          className={`shrink-0 border-b-2 pb-3 pt-1 text-sm font-bold tracking-wide transition ${
            value === key ? 'border-[var(--accent)] text-[var(--ink)]' : 'border-transparent text-[var(--ink-soft)] hover:text-[var(--ink)]'
          }`}
        >
          <span className={`mr-2 text-[10px] font-bold ${value === key ? 'text-[var(--accent)]' : 'text-[var(--ink-faint)]'}`}>
            /{String(index + 1).padStart(2, '0')}/
          </span>
          {label}
        </button>
      ))}
    </div>
  );
}
