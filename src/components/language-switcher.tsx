"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { createLocalizedHref, resolveLocale } from "@/lib/i18n";

export function LanguageSwitcher() {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const locale = resolveLocale(searchParams.get("lang"));

  return (
    <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 p-1 text-xs font-medium backdrop-blur">
      <Link
        href={createLocalizedHref(pathname, "en", searchParams)}
        className={`rounded-full px-3 py-1.5 transition-colors ${locale === "en" ? "bg-white text-slate-950" : "text-slate-300 hover:text-white"}`}
      >
        EN
      </Link>
      <Link
        href={createLocalizedHref(pathname, "ar", searchParams)}
        className={`rounded-full px-3 py-1.5 transition-colors ${locale === "ar" ? "bg-white text-slate-950" : "text-slate-300 hover:text-white"}`}
      >
        AR
      </Link>
    </div>
  );
}