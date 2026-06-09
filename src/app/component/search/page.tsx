import Link from "next/link";

import { PageShell } from "@/components/page-shell";
import { Stagger, StaggerItem } from "@/components/content-motion";
import { getBlogApi } from "@/lib/api";
import { formatLocalizedDate, resolveLocale } from "@/lib/i18n";
import { siteCopy } from "@/data/site";

type SearchPageProps = {
  searchParams?: {
    searchword?: string;
    searchphrase?: string;
    Itemid?: string;
    lang?: string;
  };
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = (searchParams?.searchword || "").trim();
  const locale = resolveLocale(searchParams?.lang);
  const copy = siteCopy[locale];
  const posts = await getBlogApi(locale);

  const results = filterResults(query, posts);

  return (
    <>
      <PageShell
        eyebrow="Blog search"
        title={query ? `Search results for “${query}”` : copy.page.blogTitle}
        description="Find blog posts by keyword, similar to the reference site search page."
      />

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <form action="/component/search" method="get" className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
          <div className="flex flex-col gap-4 md:flex-row">
            <input
              type="search"
              name="searchword"
              defaultValue={query}
              placeholder="Search ..."
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-cyan-400/40"
            />
            <input type="hidden" name="searchphrase" value="all" />
            <input type="hidden" name="Itemid" value="492" />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-cyan-400/10 px-6 py-3 text-sm font-medium text-cyan-200 transition-colors hover:bg-cyan-400/20"
            >
              Search
            </button>
          </div>
        </form>

        <div className="mt-8 space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">{results.length} results</p>
          <Stagger className="grid gap-6">
            {results.map((post) => (
              <StaggerItem key={post.slug}>
                <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_60px_rgba(2,6,23,0.3)] backdrop-blur-xl md:p-6">
                  <div className="grid gap-4 md:grid-cols-[240px_1fr]">
                    <div className="relative min-h-48 rounded-2xl bg-cover bg-center" style={{ backgroundImage: `linear-gradient(180deg, rgba(2,6,23,0.1), rgba(2,6,23,0.78)), url(${post.image})` }} />
                    <div className="space-y-3">
                      <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Blog</p>
                      <Link href={`/blog/${post.slug}`} className="block text-2xl font-semibold text-white transition-colors hover:text-cyan-300">
                        {post.title}
                      </Link>
                      <p className="text-sm text-slate-400">{formatLocalizedDate(post.createdAt, locale)}</p>
                      <p className="text-sm leading-7 text-slate-300">{post.excerpt}</p>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}

function filterResults(query: string, posts: Array<{ title: string; excerpt: string; content: string; slug: string; createdAt: string; image: string }>) {
  if (!query) {
    return posts.slice(0, 6);
  }

  const normalizedQuery = query.toLowerCase();
  return posts.filter((post) => {
    const haystack = [post.title, post.excerpt, post.content, post.slug]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}
