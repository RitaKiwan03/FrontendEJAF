import Link from "next/link";
import { IconMark } from "@/components/icon-mark";

type ServiceCardProps = {
  title: string;
  description: string;
  icon: string;
  gif?: string;
  serviceLabel?: string;
};

export function ServiceCard({
  title,
  description,
  icon,
  gif,
  serviceLabel = "Service",
}: ServiceCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.05] shadow-[0_20px_60px_rgba(2,6,23,0.35)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-cyan-300/25 hover:shadow-[0_32px_80px_rgba(2,6,23,0.55),0_0_0_1px_rgba(34,211,238,0.08)]">
      {gif ? (
        <div className="relative h-48 w-full overflow-hidden border-b border-white/10 bg-slate-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.08),transparent_70%)]" />
          <img
            src={gif}
            alt={title}
            className="h-full w-full object-cover opacity-85 transition-all duration-700 group-hover:scale-[1.04] group-hover:opacity-100"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
        </div>
      ) : null}

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <IconMark name={icon} />
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/[0.08] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-cyan-300">
            {serviceLabel}
          </span>
        </div>
        <h3 className="mt-5 text-xl font-semibold text-white transition-colors duration-300 group-hover:text-cyan-50">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>

        <div className="mt-5 h-px w-0 bg-gradient-to-r from-cyan-400/60 to-indigo-400/40 transition-all duration-500 group-hover:w-full" />
      </div>
    </article>
  );
}

// 🛡️ 1. تحديث الـ Type ليدعم الكائن القادم من لارافيل أو النص العادي
type ProjectCardProps = {
  title: string;
  description: string;
  image: string;
  technologies: string | { en?: string; ar?: string };
  isAr: boolean; // 🌟 إضافة المتغير لتحديد اللغة داخل البطاقة
};

// 🛡️ 2. استقبال الـ isAr كـ Prop هنا ليعمل بداخل الشرط المطور
export function ProjectCard({
  title,
  description,
  image,
  technologies,
  isAr,
}: ProjectCardProps) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-[0_20px_60px_rgba(2,6,23,0.45)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1">
      <div
        className="relative h-64 border-b border-white/10 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_36%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(15,23,42,0.55))]"
        style={{
          backgroundImage: image
            ? `linear-gradient(135deg, rgba(15,23,42,0.68), rgba(15,23,42,0.25)), url(${image})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="space-y-4 p-6">
        {/* الكود المطور بعد معالجة الـ Types والتأكد من عدم كسر الصفحة */}
        <div className="flex flex-wrap gap-2">
          {(() => {
            let techString = "";

            if (technologies && typeof technologies === "object") {
              techString = isAr ? technologies.ar || "" : technologies.en || "";
            } else if (typeof technologies === "string") {
              techString = technologies;
            }

            return techString
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
              .map((technology) => (
                <span
                  key={technology}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-300"
                >
                  {technology}
                </span>
              ));
          })()}
        </div>

        <h3 className="text-2xl font-semibold text-white">{title}</h3>
        <p className="text-sm leading-7 text-slate-300">{description}</p>
      </div>
    </article>
  );
}

type BlogCardProps = {
  title: string;
  excerpt: string;
  createdAt: string;
  image: string;
  href: string;
  readLabel?: string;
};

export function BlogCard({
  title,
  excerpt,
  createdAt,
  image,
  href,
  readLabel = "Read article",
}: BlogCardProps) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.05] shadow-[0_20px_60px_rgba(2,6,23,0.3)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1">
      <div
        className="h-48 bg-cover bg-center"
        style={{
          backgroundImage: image
            ? `linear-gradient(180deg, rgba(2,6,23,0.1), rgba(2,6,23,0.78)), url(${image})`
            : undefined,
        }}
      />
      <div className="space-y-3 p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">
          {createdAt}
        </p>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-sm leading-7 text-slate-300">{excerpt}</p>
        <Link
          href={href}
          className="inline-flex text-sm font-medium text-cyan-200 transition-colors group-hover:text-white"
        >
          {readLabel}
        </Link>
      </div>
    </article>
  );
}

type StatCardProps = {
  value: string;
  label: string;
  text?: string;
};

export function StatCard({ value, label, text }: StatCardProps) {
  return (
    <article className="rounded-[1.5rem] border border-white/10 bg-slate-950/60 p-6 shadow-[0_20px_50px_rgba(2,6,23,0.28)] backdrop-blur-xl">
      <p className="text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>
      <p className="mt-2 text-sm font-medium uppercase tracking-[0.22em] text-cyan-300">
        {label}
      </p>
      {text ? (
        <p className="mt-3 text-sm leading-7 text-slate-400">{text}</p>
      ) : null}
    </article>
  );
}
