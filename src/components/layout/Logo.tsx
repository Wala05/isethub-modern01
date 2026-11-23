export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className={`text-xl font-extrabold leading-none tracking-tight ${light ? 'text-[#fafaf7]' : 'text-[var(--ink)]'}`}>
        Iset<span className="text-[var(--accent)]">Hub</span>
      </span>
      <span className={`hidden text-[10px] font-bold uppercase tracking-[.2em] sm:inline ${light ? 'text-[#fafaf7]/50' : 'text-[var(--ink-faint)]'}`}>
        ISET Djerba
      </span>
    </span>
  );
}
