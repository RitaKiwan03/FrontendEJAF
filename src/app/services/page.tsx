import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/content-cards";
import { Stagger, StaggerItem } from "@/components/content-motion";
import { getServicesApi } from "@/lib/api";
import { resolveLocale, translate } from "@/lib/i18n";
import { serviceHighlights } from "@/data/services";
import { siteCopy } from "@/data/site";

type ServicesPageProps = {
  searchParams?: {
    lang?: string;
  };
};

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const locale = resolveLocale(searchParams?.lang);
  const copy = siteCopy[locale];
  const services = await getServicesApi(locale);

  return (
    <>
      <PageShell
        eyebrow={copy.page.servicesTitle}
        title={copy.page.servicesTitle}
        description={copy.home.servicesDescription}
      />

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <SectionHeading
          eyebrow={copy.page.servicesCapabilities}
          title={copy.page.servicesCapabilitiesTitle}
          description={copy.page.servicesCapabilitiesDescription}
        />

        <Stagger className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <StaggerItem key={service.id}>
              <ServiceCard title={service.title} description={service.description} icon={service.icon} gif={service.gif} serviceLabel={copy.serviceLabel} />
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-16 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-[0_20px_80px_rgba(2,6,23,0.45)]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
            {["/gifs/service-8.gif", "/gifs/service-9.gif", "/gifs/scervice-10.gif", "/gifs/scervice-11.gif", "/gifs/service-12.gif", "/gifs/service-14.gif"].map((gif, i) => (
              <div key={i} className="group relative aspect-video overflow-hidden border-r border-white/10 last:border-r-0 md:aspect-square">
                <img
                  src={gif}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover opacity-70 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              </div>
            ))}
          </div>
        </div>

        <Stagger className="mt-12 grid gap-6 lg:grid-cols-2">
          {serviceHighlights.map((item) => (
            <StaggerItem key={item.id}>
              <article className="rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.28)] backdrop-blur-xl">
                <h3 className="text-xl font-semibold text-white">{translate(locale, item.title)}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{translate(locale, item.description)}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </>
  );
}