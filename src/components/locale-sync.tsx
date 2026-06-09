"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { resolveLocale } from "@/lib/i18n";

export function LocaleSync() {
  const searchParams = useSearchParams();
  const locale = resolveLocale(searchParams.get("lang"));

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  return null;
}