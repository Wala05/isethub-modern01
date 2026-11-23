import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowRight, BookOpen, Car, CornerDownLeft, FileText, Home, MessageCircle, Search, Store, Users, type LucideIcon } from 'lucide-react';
import { mockResources } from '@/lib/resources';
import { navItems } from '@/lib/nav';
import type { GoFn } from '@/lib/types';

type PaletteItem = { id: string; group: string; label: string; hint: string; icon: LucideIcon; run: () => void };

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
    ...navItems.map<PaletteItem>((item) => ({ id: 'nav-' + item.key, group: 'Aller à', label: item.label, hint: 'Page', icon: item.icon, run: jump(item.key) })),
    { id: 'q-exam', group: 'Raccourcis', label: 'Examens corrigés', hint: 'Études', icon: FileText, run: jump('etudes', 'Examen') },
    { id: 'q-td', group: 'Raccourcis', label: 'TD & TP', hint: 'Études', icon: BookOpen, run: jump('etudes', 'TD') },
    { id: 'q-coloc', group: 'Raccourcis', label: 'Trouver une colocation', hint: 'Logement', icon: Home, run: jump('vie', 'logement') },
    { id: 'q-covoit', group: 'Raccourcis', label: 'Covoiturage vers le campus', hint: 'Trajets', icon: Car, run: jump('vie', 'covoit') },
    { id: 'q-deals', group: 'Raccourcis', label: 'Restos, cafés d’étude, imprimeries', hint: 'Bons plans', icon: Store, run: jump('vie', 'bons') },
    { id: 'q-clubs', group: 'Raccourcis', label: 'Rejoindre un club', hint: 'Clubs', icon: Users, run: jump('clubs') },
    { id: 'q-forum', group: 'Raccourcis', label: 'Poser une question à la communauté', hint: 'Entraide', icon: MessageCircle, run: jump('marketplace', 'forum') },
    ...mockResources.map<PaletteItem>((r) => ({ id: 'res-' + r.id, group: 'Ressources', label: r.title, hint: `${r.resource_type} · ${r.department} · ${r.semester}`, icon: FileText, run: jump('etudes', undefined, r.title) })),
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
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-[#021d33]/55 px-3 pt-[8vh] backdrop-blur-sm sm:pt-[12vh]" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Recherche" onClick={(event) => event.stopPropagation()} className="animate-pop-in w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-100 px-4">
          <Search size={20} className="shrink-0 text-[#126cb1]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => { setQuery(event.target.value); setActive(0); }}
            onKeyDown={onKeyDown}
            placeholder="Cours, coloc, covoit, club…"
            className="h-14 min-w-0 flex-1 bg-transparent text-base font-semibold outline-none placeholder:text-slate-400"
          />
          <kbd className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-400">ESC</kbd>
        </div>
        <div className="max-h-[56vh] overflow-y-auto p-2">
          {results.length === 0 && <p className="px-3 py-8 text-center text-sm font-semibold text-slate-400">Rien trouvé pour « {query} ».</p>}
          {results.map((item, index) => {
            const showGroup = item.group !== lastGroup;
            lastGroup = item.group;
            const Icon = item.icon;
            return (
              <div key={item.id}>
                {showGroup && <p className="px-3 pb-1 pt-3 text-[10px] font-extrabold uppercase tracking-[.16em] text-slate-400">{item.group}</p>}
                <button
                  onMouseEnter={() => setActive(index)}
                  onClick={item.run}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition ${index === current ? 'bg-[#e8f3fb]' : ''}`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eaf5fc] text-[#126cb1]"><Icon size={17} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">{item.label}</span>
                    <span className="block text-xs font-semibold text-slate-400">{item.hint}</span>
                  </span>
                  {index === current ? <CornerDownLeft size={15} className="text-[#126cb1]" /> : <ArrowRight size={14} className="text-slate-300" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
