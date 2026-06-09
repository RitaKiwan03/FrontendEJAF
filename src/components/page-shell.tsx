import type { ReactNode } from "react";
import { Reveal } from "@/components/content-motion";

type PageShellProps = {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function PageShell({ eyebrow, title, description, children }: PageShellProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <Reveal className="max-w-4xl space-y-6 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_80px_rgba(2,6,23,0.35)] backdrop-blur-xl sm:rounded-[2rem] sm:p-8 lg:p-10">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">{eyebrow}</p>
        ) : null}
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">{title}</h1>
          <p className="max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">{description}</p>
        </div>
        {children ? <div className="pt-4">{children}</div> : null}
      </Reveal>
    </section>
  );
}