import type { Locale, LocalizedText } from "@/lib/content-types";

export const locales: Locale[] = ["en", "ar"];

export function resolveLocale(value?: string | null): Locale {
  return value === "ar" ? "ar" : "en";
}

export function translate(locale: Locale, text: LocalizedText) {
  return text[locale] ?? text.en;
}

export function createLocalizedHref(pathname: string, locale: Locale, searchParams?: URLSearchParams | null) {
  const query = new URLSearchParams(searchParams ? Array.from(searchParams.entries()) : []);

  if (locale === "en") {
    query.delete("lang");
  } else {
    query.set("lang", locale);
  }

  const queryString = query.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}

export function formatLocalizedDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}