import { PageShell } from "@/components/page-shell";
import { StatCard } from "@/components/content-cards";
import { companySummary, siteCopy, siteStats } from "@/data/site";
import { resolveLocale, translate } from "@/lib/i18n";

type AboutPageProps = {
  searchParams?: {
    lang?: string;
  };
};

export default function AboutPage({ searchParams }: AboutPageProps) {
  const locale = resolveLocale(searchParams?.lang);
  const copy = siteCopy[locale];

  return (
    <PageShell
      eyebrow={copy.page.aboutTitle}
      title={copy.page.aboutTitle}
      description={copy.contact.description}
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-4">
          {companySummary.map((item) => (
            <article key={item.title.en} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_60px_rgba(2,6,23,0.28)] backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">{translate(locale, item.eyebrow)}</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">{translate(locale, item.title)}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{translate(locale, item.description)}</p>
            </article>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {siteStats.map((stat) => (
            <StatCard key={stat.label.en} value={stat.value} label={stat.label[locale]} text={copy.page.operationalCoverage} />
          ))}
        </div>
      </div>
    </PageShell>
  );
}