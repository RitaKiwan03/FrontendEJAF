import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/content-motion";
import { getBlogApi, getBlogItemApi } from "@/lib/api";
import { formatLocalizedDate, resolveLocale } from "@/lib/i18n";
import { siteCopy } from "@/data/site";

type BlogPageProps = {
  params: { slug: string };
  searchParams?: { lang?: string };
};

// ✅ إصلاح generateStaticParams — يمنع الخطأ في Vercel
export async function generateStaticParams() {
  try {
    const posts = await getBlogApi("en");
    const slugs = posts.map((post) => post.slug).filter(Boolean);
    return Array.from(new Set(slugs)).map((slug) => ({ slug }));
  } catch {
    // ✅ إذا فشل الجلب لا يوقف البناء
    return [];
  }
}

// ✅ Dynamic rendering للتأكد من جلب أحدث البيانات
export const dynamic = "force-dynamic";

// ✅ Helper لتحويل tags لأي صيغة إلى array
function parseTags(tags: any, locale: string): string[] {
  if (!tags) return [];

  // إذا كان object من الباك إند { en: "...", ar: "..." }
  if (typeof tags === "object" && !Array.isArray(tags)) {
    const raw = locale === "ar" ? tags.ar : tags.en;
    if (!raw) return [];
    return raw
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);
  }

  // إذا كان string مباشرة
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  // إذا كان array
  if (Array.isArray(tags)) {
    return tags.filter(Boolean);
  }

  return [];
}

export default async function BlogArticlePage({
  params,
  searchParams,
}: BlogPageProps) {
  const locale = resolveLocale(searchParams?.lang);
  const copy = siteCopy[locale];
  const isAr = locale === "ar";

  const post = await getBlogItemApi(locale, params.slug);

  if (!post) {
    notFound();
  }

  const popularPosts = await getBlogApi(locale);

  // ✅ تحويل tags بشكل آمن
  const tags = parseTags(post.tags, locale);

  // ✅ تحويل content بشكل آمن
  const content = typeof post.content === "string" ? post.content : "";

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <Reveal className="space-y-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_20px_80px_rgba(2,6,23,0.35)] backdrop-blur-xl">
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {isAr ? "المدونة" : "Blog"}
          </h1>
          <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
            <li>
              <Link
                href={isAr ? "/?lang=ar" : "/"}
                className="transition-colors hover:text-white"
              >
                {copy.page.blogBreadcrumbHome}
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href={isAr ? "/blog?lang=ar" : "/blog"}
                className="transition-colors hover:text-white"
              >
                {copy.page.blogBreadcrumbBlog}
              </Link>
            </li>
            <li>/</li>
            <li className="text-slate-200">{post.title}</li>
          </ol>
        </Reveal>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.8fr)] lg:items-start">
          <article className="space-y-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_80px_rgba(2,6,23,0.35)] backdrop-blur-xl sm:p-8">
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-cyan-300">
                {copy.page.blogFeaturedLabel}
              </span>
              <span>{formatLocalizedDate(post.createdAt, locale)}</span>
              <span>•</span>
              <span>EJAF Technology</span>
            </div>

            {post.image && (
              <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/70">
                <div
                  className="aspect-[16/9] bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(2,6,23,0.08), rgba(2,6,23,0.82)), url(${post.image})`,
                  }}
                />
              </div>
            )}

            <header className="space-y-4">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                {post.title}
              </h1>
              <p className="text-lg leading-8 text-slate-300">{post.excerpt}</p>
            </header>

            <div
              className="space-y-6 text-sm leading-7 text-slate-300 sm:text-base"
              dir={isAr ? "rtl" : "ltr"}
            >
              {content
                .split("\n\n")
                .filter(Boolean)
                .map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
            </div>

            {/* ✅ Tags مصحح — يعمل مع string و array و object */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 border-t border-white/10 pt-6">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          <aside className="space-y-6">
            <form
              action={isAr ? "/blog?lang=ar" : "/blog"}
              method="get"
              className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5"
            >
              <div className="flex gap-3">
                <input
                  type="search"
                  name="q"
                  placeholder={copy.page.blogSearchPlaceholder}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-colors focus:border-cyan-400/40"
                />
                {isAr && <input type="hidden" name="lang" value="ar" />}
                <button
                  type="submit"
                  className="rounded-2xl border border-white/10 bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-200 transition-colors hover:bg-cyan-400/20"
                >
                  {copy.page.blogSearchButton}
                </button>
              </div>
            </form>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_80px_rgba(2,6,23,0.24)] backdrop-blur-xl">
              <h2 className="text-xl font-semibold text-white">
                {copy.page.blogRelatedPosts}
              </h2>
              <div className="mt-5 space-y-4">
                {popularPosts
                  .filter((item) => item.slug !== post.slug)
                  .slice(0, 3)
                  .map((item) => (
                    <article
                      key={item.id}
                      className="space-y-2 border-b border-white/10 pb-4 last:border-b-0 last:pb-0"
                    >
                      <Link
                        href={`/blog/${item.slug}${isAr ? "?lang=ar" : ""}`}
                        className="block text-base font-medium text-white transition-colors hover:text-cyan-300"
                      >
                        {item.title}
                      </Link>
                      <p className="text-sm text-slate-400">
                        {formatLocalizedDate(item.createdAt, locale)}
                      </p>
                    </article>
                  ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_80px_rgba(2,6,23,0.24)] backdrop-blur-xl">
              <h2 className="text-xl font-semibold text-white">
                {copy.page.blogMoreReading}
              </h2>
              <div className="mt-5 space-y-4">
                {popularPosts.slice(0, 2).map((item) => (
                  <Link
                    key={item.id}
                    href={`/blog/${item.slug}${isAr ? "?lang=ar" : ""}`}
                    className="block rounded-2xl border border-white/10 bg-slate-950/55 p-4 text-sm text-slate-300 transition-colors hover:border-cyan-300/20 hover:text-white"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
