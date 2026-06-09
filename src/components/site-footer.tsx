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
          <p>
            {copy.footerCopyright.split("love").map((part, i, arr) =>
              i < arr.length - 1 ? (
                <span key={i}>
                  {part}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="inline-block h-3.5 w-3.5 align-middle text-slate-900 mx-0.5"
                    aria-hidden="true"
                  >
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                </span>
              ) : (
                <span key={i}>{part}</span>
              ),
            )}
          </p>
          <p>{copy.footerNote}</p>
        </div>
      </div>
    </footer>
  );
}
