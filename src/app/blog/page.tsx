import Link from "next/link";

import { PageShell } from "@/components/page-shell";
import { BlogCard } from "@/components/content-cards";
import { Stagger, StaggerItem } from "@/components/content-motion";
import { getBlogApi } from "@/lib/api";
import { formatLocalizedDate, resolveLocale } from "@/lib/i18n";
import { siteCopy } from "@/data/site";

type BlogPageProps = {
  searchParams?: {
    lang?: string;
  };
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const locale = resolveLocale(searchParams?.lang);
  const copy = siteCopy[locale];
  const posts = await getBlogApi(locale);
  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 4);

  return (
    <>
      <PageShell
        eyebrow={copy.page.blogTitle}
        title={copy.page.blogTitle}
        description={copy.home.blogDescription}
      />

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.7fr)]">
          <div className="space-y-6">
            {featuredPost ? (
              <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_20px_80px_rgba(2,6,23,0.35)] backdrop-blur-xl">
                <div className="relative aspect-[16/9] bg-cover bg-center" style={{ backgroundImage: `linear-gradient(180deg, rgba(2,6,23,0.12), rgba(2,6,23,0.82)), url(${featuredPost.image})` }} />
                <div className="space-y-4 p-6 sm:p-8">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">{copy.page.blogFeaturedLabel}</p>
                  <h2 className="text-3xl font-semibold text-white">{featuredPost.title}</h2>
                  <p className="text-sm leading-7 text-slate-300">{featuredPost.excerpt}</p>
                  <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-slate-400">
                    <span>{formatLocalizedDate(featuredPost.createdAt, locale)}</span>
                    <span>{featuredPost.tags[0]}</span>
                  </div>
                  <Link href={`/blog/${featuredPost.slug}`} className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-sm text-white transition-colors hover:bg-white/10">
                    {copy.page.blogReadMore}
                  </Link>
                </div>
              </article>
            ) : null}

            <Stagger className="grid gap-6 md:grid-cols-2">
              {recentPosts.map((post) => (
                <StaggerItem key={post.id}>
                  <BlogCard title={post.title} excerpt={post.excerpt} createdAt={formatLocalizedDate(post.createdAt, locale)} image={post.image} href={`/blog/${post.slug}${locale === "ar" ? "?lang=ar" : ""}`} readLabel={copy.readArticleLabel} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <aside className="space-y-6">
            <form action="/component/search" method="get" className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
              <div className="flex gap-3">
                <input
                  type="search"
                  name="searchword"
                  placeholder={copy.page.blogSearchPlaceholder}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-cyan-400/40"
                />
                <input type="hidden" name="searchphrase" value="all" />
                <input type="hidden" name="Itemid" value="492" />
                <button
                  type="submit"
                  className="rounded-2xl border border-white/10 bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-200 transition-colors hover:bg-cyan-400/20"
                >
                  {copy.page.blogSearchButton}
                </button>
              </div>
            </form>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
              <h2 className="text-xl font-semibold text-white">{copy.page.blogPopularPosts}</h2>
              <div className="mt-5 space-y-4">
                {recentPosts.map((post) => (
                  <article key={post.id} className="space-y-2 border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                    <Link href={`/blog/${post.slug}`} className="block text-base font-medium text-white transition-colors hover:text-cyan-300">
                      {post.title}
                    </Link>
                    <p className="text-sm text-slate-400">{formatLocalizedDate(post.createdAt, locale)}</p>
                  </article>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
