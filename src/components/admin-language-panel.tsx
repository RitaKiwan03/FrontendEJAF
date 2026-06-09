import type { ReactNode } from "react";

type AdminLanguagePanelProps = {
  title: string;
  description: string;
  children: ReactNode;
  dir?: "ltr" | "rtl";
};

export function AdminLanguagePanel({ title, description, children, dir = "ltr" }: AdminLanguagePanelProps) {
  return (
    <section dir={dir} className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-5">
      <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-400">{description}</p>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
