import type { ReactNode } from 'react';

type PageShellProps = { eyebrow: string; title: string; intro: string; children: ReactNode };

export function PageShell({ eyebrow, title, intro, children }: PageShellProps) {
  return (
    <main className="container-page pb-24 pt-12 lg:pb-16 lg:pt-20">
      <div className="animate-rise rule-strong max-w-3xl pt-8">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-[-.03em] sm:text-6xl">{title}</h1>
        <p className="mt-5 text-base leading-7 text-[var(--ink-soft)] sm:text-lg sm:leading-8">{intro}</p>
      </div>
      <div className="mt-12">{children}</div>
    </main>
  );
}
