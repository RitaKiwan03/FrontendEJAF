"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Settings } from "lucide-react";
import {
  LayoutDashboard,
  Layers,
  FolderKanban,
  BookOpen,
  LogOut,
  ChevronRight,
  MapPin,
  Mail,
  Users,
  Radio,
} from "lucide-react";

import { createLocalizedHref, resolveLocale } from "@/lib/i18n";
import { getVisitorStatsApi } from "@/lib/api";
import { useEffect, useState } from "react";

const navItems = [
  {
    href: "/admin/dashboard",
    labelEn: "Dashboard",
    labelAr: "لوحة التحكم",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/services",
    labelEn: "Services",
    labelAr: "الخدمات",
    icon: Layers,
  },
  {
    href: "/admin/projects",
    labelEn: "Projects",
    labelAr: "المشاريع",
    icon: FolderKanban,
  },
  { href: "/admin/blog", labelEn: "Blog", labelAr: "المدونة", icon: BookOpen },
  {
    href: "/admin/messages",
    labelEn: "Messages",
    labelAr: "الرسائل",
    icon: Mail,
  },
  {
    href: "/admin/locations",
    labelEn: "Locations",
    labelAr: "المواقع",
    icon: MapPin,
  },
  {
    href: "/admin/visitors",
    labelEn: "Visitors",
    labelAr: "الزوار",
    icon: Users,
  },
  {
    href: "/admin/settings",
    labelEn: "Settings",
    labelAr: "الإعدادات",
    icon: Settings,
  },
];

type AdminShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function AdminShell({ title, description, children }: AdminShellProps) {
  const pathname = usePathname() || "/admin/dashboard";
  const searchParams = useSearchParams();
  const locale = resolveLocale(searchParams.get("lang"));
  const router = useRouter();
  const [online, setOnline] = useState<number>(0);

  useEffect(() => {
    async function fetchOnline() {
      const stats = await getVisitorStatsApi().catch(() => null);
      if (stats) setOnline(stats.online);
    }
    fetchOnline();
    const interval = setInterval(fetchOnline, 30000);
    return () => clearInterval(interval);
  }, []);

  function handleLogout(e: React.MouseEvent) {
    e.preventDefault();
    router.push(locale === "ar" ? "/admin/logout?lang=ar" : "/admin/logout");
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8 lg:py-8">
      <aside className="flex flex-col gap-4">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300">
            {locale === "ar" ? "إدارة EJAF" : "EJAF Admin"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {locale === "ar"
              ? "نظام إدارة المحتوى"
              : "Content Management System"}
          </p>
        </div>

        <nav className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-3 backdrop-blur-xl">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500">
            {locale === "ar" ? "التنقل" : "Navigation"}
          </p>
          <div className="space-y-1">
            {navItems.map(({ href, labelEn, labelAr, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={createLocalizedHref(href, locale, searchParams)}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-cyan-400/10 text-white ring-1 ring-cyan-400/20"
                      : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                  <span className="flex-1">
                    {locale === "ar" ? labelAr : labelEn}
                  </span>
                  {active && (
                    <ChevronRight className="h-3.5 w-3.5 text-cyan-300" />
                  )}
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-400/10 hover:text-rose-300"
            >
              <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.8} />
              {locale === "ar" ? "تسجيل الخروج" : "Logout"}
            </button>
          </div>
        </nav>

        {/* Online Now Card */}
        <div className="rounded-[1.75rem] border border-green-400/15 bg-green-400/[0.04] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-green-300" strokeWidth={1.8} />
              <p className="text-xs font-semibold text-green-300">
                {locale === "ar" ? "متصلون الآن" : "Online Now"}
              </p>
            </div>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-semibold text-white">{online}</p>
          <p className="mt-1 text-xs text-slate-400">
            {locale === "ar" ? "آخر 5 دقائق" : "Active last 5 min"}
          </p>
        </div>
      </aside>

      <main className="min-w-0 space-y-6">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] px-6 py-5 backdrop-blur-xl">
          <h1 className="text-2xl font-semibold text-white">{title}</h1>
          {description && (
            <p className="mt-1 text-sm leading-6 text-slate-400">
              {description}
            </p>
          )}
        </div>
        {children}
      </main>
    </div>
  );
}

type AdminSectionProps = {
  label?: string;
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
};

export function AdminSection({
  label,
  title,
  description,
  children,
  action,
}: AdminSectionProps) {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl">
      {label && (
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-300">
          {label}
        </p>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          {description && (
            <p className="text-sm leading-6 text-slate-400">{description}</p>
          )}
        </div>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
