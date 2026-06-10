import { PageShell } from "@/components/page-shell";
import { ProjectCard } from "@/components/content-cards";
import { Stagger, StaggerItem } from "@/components/content-motion";
import { getProjectsApi } from "@/lib/api";
import { resolveLocale, translate } from "@/lib/i18n";
import { solutionHighlights, siteCopy } from "@/data/site";

type ProjectsPageProps = {
  searchParams?: { lang?: string };
};

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const locale = resolveLocale(searchParams?.lang);
  const isAr = locale === "ar";
  const copy = siteCopy[locale];
  const projects = await getProjectsApi(locale);

  return (
    <>
      <PageShell
        eyebrow={copy.page.projectsTitle}
        title={copy.page.projectsTitle}
        description={copy.home.projectsDescription}
      />

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <Stagger className="grid gap-6 lg:grid-cols-2">
          {projects.map((project) => (
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
                isAr={isAr}
              />
            </StaggerItem>
          ))}
        </Stagger>

        <Stagger className="mt-12 grid gap-6 md:grid-cols-2">
          {solutionHighlights.map((item) => (
            <StaggerItem key={item.title.en}>
              <article className="rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.28)] backdrop-blur-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
                  {translate(locale, item.eyebrow)}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-white">
                  {translate(locale, item.title)}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {translate(locale, item.description)}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </>
  );
}
