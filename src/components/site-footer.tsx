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

        <div className="mt-6 flex flex-col items-center gap-3 text-sm text-slate-500">
          <div className="text-center leading-6">
            <p>Copyright © 2026 EJAF Technology. All rights reserved</p>
            <p className="flex items-center justify-center gap-1">
              Made with
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="inline-block h-3.5 w-3.5 text-slate-900 mx-0.5"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
              by Rayan
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="X"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
