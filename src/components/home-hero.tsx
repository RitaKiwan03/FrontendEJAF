import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Reveal } from "@/components/content-motion";
import { StatCounter } from "@/components/stats-counter";
import { IconMark } from "@/components/icon-mark";
import { siteCopy, siteStats } from "@/data/site";
import { createLocalizedHref } from "@/lib/i18n";
import type { Locale } from "@/lib/content-types";

const capabilities = [
  { icon: "server", titleKey: "Data Centers", descKey: "infraDesc1" },
  { icon: "cloud", titleKey: "Cloud", descKey: "infraDesc2" },
  { icon: "shield", titleKey: "Security", descKey: "infraDesc3" },
  { icon: "network", titleKey: "Networking", descKey: "infraDesc4" },
] as const;

type HomeHeroProps = {
  locale: Locale;
};

export function HomeHero({ locale }: HomeHeroProps) {
  const copy = siteCopy[locale];

  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_30%),radial-gradient(circle_at_78%_12%,_rgba(129,140,248,0.18),_transparent_22%),linear-gradient(180deg,_rgba(2,6,23,0.88),_rgba(2,6,23,1))]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_82%)]" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-14 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="max-w-3xl space-y-8">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200 backdrop-blur">
                <Sparkles className="h-4 w-4" />
                {copy.hero.eyebrow}
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="space-y-5">
                <h1 className="hero-title text-3xl font-semibold tracking-tight text-white text-balance sm:text-4xl md:text-5xl lg:text-6xl">
                  {copy.hero.title}
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                  {copy.hero.description}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={createLocalizedHref("/services", locale)}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-950/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-cyan-950/20"
                >
                  {copy.hero.primaryCta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={createLocalizedHref("/contact", locale)}
                  className="rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-medium text-white backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                >
                  {copy.hero.secondaryCta}
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {siteStats.map((stat, index) => (
              <Reveal key={stat.label[locale]} delay={0.04 * index}>
                <StatCounter
                  finalValue={stat.value}
                  label={stat.label[locale]}
                  delay={0.04 * index}
                />
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal>
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-950/90 to-slate-900/80 shadow-[0_20px_80px_rgba(2,6,23,0.55)] backdrop-blur-xl">
            {/* top accent line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

            <div className="grid grid-cols-2 divide-x divide-white/[0.06] lg:grid-cols-4">
              {capabilities.map(({ icon, titleKey }, i) => {
                const labels = copy.hero.eyebrow.split(" • ");
                const label = labels[i] ?? titleKey;
                const descriptions = [
                  copy.hero.infraCardDescription,
                  copy.hero.infraCardItemText,
                  copy.hero.infraCardItemText,
                  copy.hero.infraCardItemText,
                ];
                return (
                  <div
                    key={icon}
                    className="group relative flex flex-col gap-4 p-6 transition-colors duration-300 hover:bg-white/[0.03] sm:p-8"
                  >
                    {/* subtle hover glow */}
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [background:radial-gradient(120px_circle_at_50%_0%,rgba(34,211,238,0.07),transparent)]" />
                    <IconMark name={icon} />
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        {label}
                      </h3>
                      <p className="mt-1.5 text-sm leading-6 text-slate-400">
                        {descriptions[i]}
                      </p>
                    </div>
                    {/* bottom accent on hover */}
                    <div className="absolute bottom-0 left-6 right-6 h-px scale-x-0 bg-gradient-to-r from-cyan-400/50 to-indigo-400/50 transition-transform duration-500 group-hover:scale-x-100" />
                  </div>
                );
              })}
            </div>

            {/* bottom accent line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
