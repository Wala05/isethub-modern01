import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { mockResources } from '@/lib/resources';
import { navItems } from '@/lib/nav';
import type { GoFn } from '@/lib/types';

type PaletteItem = { id: string; group: string; label: string; hint: string; run: () => void };

const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

type CommandPaletteProps = { open: boolean; onClose: () => void; go: GoFn };

export function CommandPalette({ open, onClose, go }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActive(0);
    window.setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);

  if (!open) return null;

  const jump = (view: Parameters<GoFn>[0], sub?: string, q?: string) => () => { go(view, sub, q); onClose(); };

  const items: PaletteItem[] = [
    ...navItems.map<PaletteItem>((item) => ({ id: 'nav-' + item.key, group: 'Aller à', label: item.label, hint: 'Page', run: jump(item.key) })),
    { id: 'q-exam', group: 'Raccourcis', label: 'Examens corrigés', hint: 'Études', run: jump('etudes', 'Examen') },
    { id: 'q-td', group: 'Raccourcis', label: 'TD & TP', hint: 'Études', run: jump('etudes', 'TD') },
    { id: 'q-coloc', group: 'Raccourcis', label: 'Trouver une colocation', hint: 'Logement', run: jump('vie', 'logement') },
    { id: 'q-covoit', group: 'Raccourcis', label: 'Covoiturage vers le campus', hint: 'Trajets', run: jump('vie', 'covoit') },
    { id: 'q-deals', group: 'Raccourcis', label: 'Restos, cafés d’étude, imprimeries', hint: 'Bons plans', run: jump('vie', 'bons') },
    { id: 'q-clubs', group: 'Raccourcis', label: 'Rejoindre un club', hint: 'Clubs', run: jump('clubs') },
    { id: 'q-forum', group: 'Raccourcis', label: 'Poser une question à la communauté', hint: 'Entraide', run: jump('marketplace', 'forum') },
    ...mockResources.map<PaletteItem>((r) => ({ id: 'res-' + r.id, group: 'Ressources', label: r.title, hint: `${r.resource_type} · ${r.department} · ${r.semester}`, run: jump('etudes', undefined, r.title) })),
  ];

  const needle = normalize(query.trim());
  const results = needle ? items.filter((item) => normalize(item.label + ' ' + item.hint).includes(needle)) : items.slice(0, 11);
  const current = Math.min(active, Math.max(results.length - 1, 0));

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive((index) => Math.min(index + 1, results.length - 1)); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setActive((index) => Math.max(index - 1, 0)); }
    else if (event.key === 'Enter') { event.preventDefault(); results[current]?.run(); }
    else if (event.key === 'Escape') onClose();
  };

  let lastGroup = '';

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-black/55 px-3 pt-[8vh] backdrop-blur-sm sm:pt-[12vh]" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Recherche" onClick={(event) => event.stopPropagation()} className="animate-fade w-full max-w-xl border border-[var(--line)] bg-[var(--surface)] shadow-2xl">
        <div className="hairline flex items-center gap-3 border-0 border-b px-5" style={{ borderBottomWidth: 1 }}>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => { setQuery(event.target.value); setActive(0); }}
            onKeyDown={onKeyDown}
            placeholder="Cours, coloc, covoit, club…"
            className="h-14 min-w-0 flex-1 bg-transparent text-base font-semibold outline-none placeholder:text-[var(--ink-faint)]"
          />
          <kbd className="index-tag border border-[var(--line)] px-2 py-1">ESC</kbd>
        </div>
        <div className="max-h-[56vh] overflow-y-auto p-2">
          {results.length === 0 && <p className="px-4 py-10 text-center text-sm font-semibold text-[var(--ink-faint)]">Rien trouvé pour « {query} ».</p>}
          {results.map((item, index) => {
            const showGroup = item.group !== lastGroup;
            lastGroup = item.group;
            return (
              <div key={item.id}>
                {showGroup && <p className="eyebrow px-4 pb-1 pt-4">{item.group}</p>}
                <button
                  onMouseEnter={() => setActive(index)}
                  onClick={item.run}
                  className={`flex w-full items-baseline gap-3 px-4 py-3 text-left transition ${index === current ? 'bg-[var(--surface-2)]' : ''}`}
                >
                  <span className="index-tag w-8 shrink-0">/{String(index + 1).padStart(2, '0')}/</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">{item.label}</span>
                    <span className="block text-xs font-semibold text-[var(--ink-faint)]">{item.hint}</span>
                  </span>
                  <span className={`index-tag shrink-0 ${index === current ? 'text-[var(--accent)]' : ''}`}>↵</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
