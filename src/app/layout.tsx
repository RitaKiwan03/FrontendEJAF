import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { LocaleSync } from "@/components/locale-sync";
import { SiteMotion } from "@/components/site-motion";
import { VisitorTracker } from "@/components/visitor-tracker";
import { SmoothScroll } from "@/components/smooth-scroll";
import { FaviconSync } from "@/app/favicon-sync";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={null}>
          <FaviconSync />
          <LocaleSync />
          <VisitorTracker />
          <SmoothScroll>
            <SiteMotion>
              <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
              </div>
            </SiteMotion>
          </SmoothScroll>
        </Suspense>
      </body>
    </html>
  );
}
