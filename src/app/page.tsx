import Link from "next/link";

import {
  BlogCard,
  ProjectCard,
  ServiceCard,
  StatCard,
} from "@/components/content-cards";
import { ContactForm } from "@/components/contact-form";
import { HomeHero } from "@/components/home-hero";
import { Reveal, Stagger, StaggerItem } from "@/components/content-motion";
import { PageShell } from "@/components/page-shell";
import { SectionHeading } from "@/components/section-heading";
import { getBlogApi, getProjectsApi, getServicesApi } from "@/lib/api";
import { resolveLocale } from "@/lib/i18n";
import { siteCopy } from "@/data/site";
import { PartnersMarquee } from "@/components/partners-marquee";

type HomePageProps = {
  searchParams?: {
    lang?: string;
  };
};

export default async function Home({ searchParams }: HomePageProps) {
  const locale = resolveLocale(searchParams?.lang);
  const copy = siteCopy[locale];
  const [services, projects, posts] = await Promise.all([
    getServicesApi(locale),
    getProjectsApi(locale),
    getBlogApi(locale),
  ]);

  return (
    <>
      <HomeHero locale={locale} />

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal>
          <SectionHeading
            eyebrow={copy.home.servicesTitle}
            title={copy.home.servicesTitle}
            description={copy.home.servicesDescription}
          />
        </Reveal>

        <Stagger className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <StaggerItem key={service.id}>
              <ServiceCard
                title={service.title}
                description={service.description}
                icon={service.icon}
                gif={service.gif}
                serviceLabel={copy.serviceLabel}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-10 lg:px-8 lg:py-24">
          <div className="space-y-6">
            <Reveal>
              <SectionHeading
                eyebrow={copy.home.techSuccessEyebrow}
                title={copy.home.techSuccessTitle}
                description={copy.home.techSuccessDescription}
              />
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={`/services${locale === "ar" ? "?lang=ar" : ""}`}
                  className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  {copy.home.viewServices}
                </Link>
                <Link
                  href={`/projects${locale === "ar" ? "?lang=ar" : ""}`}
                  className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-cyan-100 transition-colors hover:bg-cyan-400/15"
                >
                  {copy.home.viewProjects}
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {copy.hero.eyebrow.split(" • ").map((segment, index) => (
              <Reveal key={segment} delay={0.05 * index}>
                <StatCard
                  value={`0${index + 1}`}
                  label={segment}
                  text={copy.home.techSuccessCardText}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal>
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-400/10 via-white/5 to-indigo-500/10 p-8 shadow-[0_20px_80px_rgba(2,6,23,0.35)] backdrop-blur-xl sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_auto] lg:items-center">
              <div className="max-w-2xl space-y-4">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300">
                  {copy.home.whoWeAreEyebrow}
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {copy.home.whoWeAreTitle}
                </h2>
                <p className="text-base leading-7 text-slate-300 sm:text-lg">
                  {copy.home.whoWeAreDescription}
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-6 text-sm text-slate-300 backdrop-blur">
                <p className="text-white">{copy.home.locationsTitle}</p>
                <p className="mt-2 max-w-xs leading-6">
                  {copy.home.locationsText}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <Reveal>
            <SectionHeading
              eyebrow={copy.home.projectsTitle}
              title={copy.home.projectsTitle}
              description={copy.home.projectsDescription}
            />
          </Reveal>

          <Stagger className="mt-10 grid gap-6 lg:grid-cols-2">
            {projects.slice(0, 2).map((project) => (
              <StaggerItem key={project.id}>
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  image={project.image}
                  technologies={
                    Array.isArray(project.technologies)
                      ? project.technologies.join(", ")
                      : project.technologies
                  }
                  isAr={locale === "ar"}
                />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <PartnersMarquee locale={locale} />

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal>
          <SectionHeading
            eyebrow={copy.home.blogTitle}
            title={copy.home.blogTitle}
            description={copy.home.blogDescription}
          />
        </Reveal>

        <Stagger className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <StaggerItem key={post.id}>
              <BlogCard
                title={post.title}
                excerpt={post.excerpt}
                createdAt={post.createdAt}
                image={post.image}
                href={`/blog/${post.slug}${locale === "ar" ? "?lang=ar" : ""}`}
                readLabel={copy.readArticleLabel}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <PageShell
          eyebrow={copy.contact.formTitle}
          title={copy.contact.title}
          description={copy.contact.description}
        >
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <ContactForm
              namePlaceholder={copy.contact.namePlaceholder}
              emailPlaceholder={copy.contact.emailPlaceholder}
              subjectPlaceholder={copy.contact.subjectPlaceholder}
              messagePlaceholder={copy.contact.messagePlaceholder}
              submitLabel={copy.contact.submitLabel}
            />
            <div className="grid gap-4 content-start">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-6 text-sm leading-7 text-slate-300 backdrop-blur-xl">
                {copy.home.contactFootnote}
              </div>
            </div>
          </div>
        </PageShell>
      </section>
    </>
  );
}
