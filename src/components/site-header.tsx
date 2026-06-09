"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { LanguageSwitcher } from "@/components/language-switcher";
import { navigationItems, siteCopy } from "@/data/site";
import { createLocalizedHref, resolveLocale } from "@/lib/i18n";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const DEFAULT_LOGO = "/brand/EJAF Logo White.svg";

export function SiteHeader() {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const locale = resolveLocale(searchParams.get("lang"));
  const copy = siteCopy[locale];
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState(DEFAULT_LOGO);

  // في الـ useEffect
  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then((r) => r.json())
      .then((data) => {
        if (data.logo_url) setLogoUrl(API_URL + data.logo_url);
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/72 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href={createLocalizedHref("/", locale, searchParams)}
          className="group inline-flex items-center gap-3"
        >
          <img
            src={logoUrl}
            alt="EJAF"
            className="h-11 w-11 rounded-2xl object-contain"
            onError={() => setLogoUrl(DEFAULT_LOGO)}
          />
          <span className="hidden flex-col sm:flex">
            <span className="text-xs text-slate-400">{copy.tagline}</span>
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-2 py-2 text-sm text-slate-300 lg:flex"
        >
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={createLocalizedHref(item.href, locale, searchParams)}
              className={`rounded-full px-4 py-2 transition-colors hover:text-white ${pathname === item.href ? "bg-white/10 text-white" : "text-slate-300"}`}
            >
              {item.label[locale]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-200 lg:hidden"
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-slate-950/95 backdrop-blur-xl lg:hidden">
          <nav className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={createLocalizedHref(item.href, locale, searchParams)}
                onClick={() => setMobileOpen(false)}
                className={`rounded-2xl px-4 py-3 text-base transition-colors hover:bg-white/5 hover:text-white ${pathname === item.href ? "bg-white/[0.08] text-white" : "text-slate-300"}`}
              >
                {item.label[locale]}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
