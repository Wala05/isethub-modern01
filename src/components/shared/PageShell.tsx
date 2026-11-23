import type { ReactNode } from 'react';

type PageShellProps = { eyebrow: string; title: string; intro: string; children: ReactNode };

export function PageShell({ eyebrow, title, intro, children }: PageShellProps) {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-5 lg:px-8 lg:pb-16 lg:pt-12">
      <div className="animate-float-in mb-8 max-w-3xl">
        <p className="inline-flex items-center gap-2 rounded-full bg-[#e8f3fb] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[.16em] text-[#126cb1]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#fba831]" /> {eyebrow}
        </p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-[-.03em] sm:text-5xl">{title}</h1>
        <p className="mt-3 text-base leading-7 text-slate-500">{intro}</p>
      </div>
      {children}
    </main>
  );
}
