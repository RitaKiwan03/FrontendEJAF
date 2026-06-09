"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

import { footerNavigationItems, siteCopy } from "@/data/site";
import { createLocalizedHref, resolveLocale } from "@/lib/i18n";

export function SiteFooter() {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const locale = resolveLocale(searchParams.get("lang"));
  const copy = siteCopy[locale];

  return (
    <footer className="border-t border-white/10 bg-slate-950/82 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_20px_80px_rgba(2,6,23,0.35)] backdrop-blur-xl lg:grid-cols-[1fr_auto] lg:items-end lg:p-8">
          <div className="max-w-2xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300">
              {copy.brand}
            </p>
            <p className="text-2xl font-semibold tracking-tight text-white text-balance">
              {copy.footerNote}
            </p>
            <p className="max-w-xl text-sm leading-7 text-slate-400">
              {copy.tagline}
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
          >
            {footerNavigationItems.map((item) => (
              <Link
                key={item.href}
                href={createLocalizedHref(item.href, locale, searchParams)}
                className={`inline-flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-slate-300 transition-colors hover:border-cyan-400/20 hover:text-white ${pathname === item.href ? "text-white" : ""}`}
              >
                {item.label[locale]}
                <ArrowUpRight className="h-4 w-4 text-cyan-200" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-6 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>{copy.footerCopyright}</p>
          <p>{copy.footerNote}</p>
        </div>
      </div>
    </footer>
  );
}
