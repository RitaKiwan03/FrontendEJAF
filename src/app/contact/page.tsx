"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ContactForm } from "@/components/contact-form";
import { PageShell } from "@/components/page-shell";
import { siteCopy } from "@/data/site";
import { resolveLocale, translate } from "@/lib/i18n";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ─── نوع الموقع القادم من الباك إند ───────────────
type Location = {
  id: string;
  eyebrow_en: string;
  eyebrow_ar: string;
  title_en: string;
  title_ar: string;
  desc_en: string;
  desc_ar: string;
  map_url: string;
};

type Settings = {
  phone?: string;
  email?: string;
  logo_url?: string;
};

function ContactPageContent() {
  // ✅ useSearchParams بدل searchParams كـ props
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang");
  const locale = resolveLocale(lang);
  const copy = siteCopy[locale];
  const isAr = locale === "ar";

  const [settings, setSettings] = useState<Settings>({});
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLoc, setLoadingLoc] = useState(true);

  // ✅ جلب الإعدادات
  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then((r) => r.json())
      .then((data) => setSettings(data))
      .catch(() => {});
  }, []);

  // ✅ جلب المواقع من الباك إند
  useEffect(() => {
    fetch(`${API_URL}/api/locations`, {
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then((data) => setLocations(Array.isArray(data) ? data : []))
      .catch(() => setLocations([]))
      .finally(() => setLoadingLoc(false));
  }, []);

  return (
    <PageShell
      eyebrow={copy.page.contactTitle}
      title={copy.contact.title}
      description={copy.contact.description}
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <ContactForm
          namePlaceholder={copy.contact.namePlaceholder}
          emailPlaceholder={copy.contact.emailPlaceholder}
          subjectPlaceholder={copy.contact.subjectPlaceholder}
          messagePlaceholder={copy.contact.messagePlaceholder}
          submitLabel={copy.contact.submitLabel}
          isAr={isAr}
        />

        <div className="space-y-4 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 text-sm text-slate-300 backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
            {copy.contact.locationsTitle}
          </p>

          {/* ✅ مواقع من الباك إند */}
          <div className="space-y-3">
            {loadingLoc ? (
              // Loading skeleton
              Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-slate-950/55 p-4 animate-pulse"
                >
                  <div className="h-3 w-16 rounded bg-white/10 mb-2" />
                  <div className="h-4 w-32 rounded bg-white/10 mb-2" />
                  <div className="h-3 w-full rounded bg-white/10" />
                </div>
              ))
            ) : locations.length > 0 ? (
              // ✅ مواقع من الباك إند
              locations.map((loc) => (
                <article
                  key={loc.id}
                  className="rounded-2xl border border-white/10 bg-slate-950/55 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">
                    {isAr ? loc.eyebrow_ar : loc.eyebrow_en}
                  </p>
                  <p className="mt-2 text-base font-medium text-white">
                    {isAr ? loc.title_ar : loc.title_en}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-400">
                    {isAr ? loc.desc_ar : loc.desc_en}
                  </p>
                  {loc.map_url && (
                    <Link
                      href={loc.map_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex text-xs text-cyan-300 hover:text-cyan-200 transition-colors"
                    >
                      {isAr ? "عرض الخريطة" : "View on map"} →
                    </Link>
                  )}
                </article>
              ))
            ) : (
              // Fallback إذا لم توجد مواقع
              <p className="text-sm text-slate-500">
                {isAr ? "لا توجد مواقع متاحة" : "No locations available"}
              </p>
            )}
          </div>

          {/* ✅ رقم الهاتف والإيميل من الإعدادات */}
          <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4 space-y-3">
            {/* رقم الهاتف */}
            {settings.phone && (
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300 mb-1">
                  {isAr ? "الهاتف" : "Phone"}
                </p>
                <a
                  href={"tel:" + settings.phone.replace(/[\s\(\)\-]/g, "")}
                  dir="ltr"
                  className="text-white transition-colors hover:text-cyan-300"
                >
                  {settings.phone}
                </a>
              </div>
            )}

            {/* الإيميل */}
            {settings.email && (
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300 mb-1">
                  {isAr ? "البريد الإلكتروني" : "Email"}
                </p>
                <a
                  href={"mailto:" + settings.email}
                  className="text-white transition-colors hover:text-cyan-300"
                >
                  {settings.email}
                </a>
              </div>
            )}

            {/* Fallback إذا لم تكن الإعدادات محملة بعد */}
            {!settings.phone && !settings.email && (
              <div className="animate-pulse space-y-2">
                <div className="h-3 w-12 rounded bg-white/10" />
                <div className="h-4 w-36 rounded bg-white/10" />
              </div>
            )}
          </div>

          <Link
            href="https://goo.gl/maps/GSNXBQgQp22Whs8v6"
            className="inline-flex text-cyan-300 transition-colors hover:text-cyan-200"
          >
            {copy.contact.mapLabel}
          </Link>
        </div>
      </div>
    </PageShell>
  );
}

// ✅ Suspense مطلوب مع useSearchParams
export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactPageContent />
    </Suspense>
  );
}
