import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { LocaleSync } from "@/components/locale-sync";
import { SiteMotion } from "@/components/site-motion";
import { SmoothScroll } from "@/components/smooth-scroll";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "EJAF Technology",
    template: "%s | EJAF Technology",
  },
  description:
    "Premium frontend for EJAF Technology with typed content, bilingual support, and Laravel-ready APIs.",
};

async function getFaviconUrl(): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/api/settings`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const url = data.favicon_url || data.logo_url;
    if (!url) return null;
    return url.startsWith("http") ? url : API_URL + url;
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const faviconUrl = await getFaviconUrl();

  return (
    <html lang="en" dir="ltr">
      <head>
        {faviconUrl && (
          <link
            rel="icon"
            href={faviconUrl}
            type={faviconUrl.endsWith(".svg") ? "image/svg+xml" : "image/png"}
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={null}>
          <LocaleSync />
          {/* <VisitorTracker /> */}
          <SmoothScroll>
            {/* <SiteMotion> */}
              <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
              </div>
            {/* </SiteMotion> */}
          </SmoothScroll>
        </Suspense>
      </body>
    </html>
  );
}
