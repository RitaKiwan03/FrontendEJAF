"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Layers,
  FolderKanban,
  BookOpen,
  Mail,
  MapPin,
  Users,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

import { AdminShell } from "@/components/admin-shell";
import {
  getBlogApi,
  getProjectsApi,
  getServicesApi,
  getMessagesApi,
  getLocationsApi,
} from "@/lib/api";
import { resolveLocale } from "@/lib/i18n";
import { isLoggedIn } from "@/lib/admin-api";

export default function AdminDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang");
  const isAr = lang === "ar";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState({
    services: 0,
    projects: 0,
    posts: 0,
    messages: 0,
    unreadMessages: 0,
    locations: 0,
  });

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push(lang ? `/admin/login?lang=${lang}` : "/admin/login");
      return;
    }

    async function fetchDashboardData() {
      try {
        const locale = resolveLocale(lang);
        const [services, projects, posts, messages, locations] =
          await Promise.all([
            getServicesApi(locale).catch(() => []),
            getProjectsApi(locale).catch(() => []),
            getBlogApi(locale).catch(() => []),
            getMessagesApi().catch(() => []),
            getLocationsApi().catch(() => []),
          ]);

        const unread = Array.isArray(messages)
          ? messages.filter((m: any) => !m.read_at).length
          : 0;

        setCounts({
          services: services?.length || 0,
          projects: projects?.length || 0,
          posts: posts?.length || 0,
          messages: messages?.length || 0,
          unreadMessages: unread,
          locations: locations?.length || 0,
        });
      } catch {
        setError(
          isAr
            ? "فشل في الاتصال بالسيرفر"
            : "Failed to connect to backend server",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [lang, router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-300" />
      </div>
    );
  }

  const sections = [
    {
      icon: Layers,
      unread: 0,
      count: counts.services,
      label: isAr ? "الخدمات" : "Services",
      desc: isAr ? "إدارة سجلات الخدمات" : "Manage service records",
      href: "/admin/services",
      color: "text-cyan-300",
      ring: "ring-cyan-400/20",
      bg: "bg-cyan-400/10",
    },
    {
      icon: FolderKanban,
      unread: 0,
      count: counts.projects,
      label: isAr ? "المشاريع" : "Projects",
      desc: isAr ? "إدارة دراسات الحالة" : "Manage case studies",
      href: "/admin/projects",
      color: "text-indigo-300",
      ring: "ring-indigo-400/20",
      bg: "bg-indigo-400/10",
    },
    {
      icon: BookOpen,
      unread: 0,
      count: counts.posts,
      label: isAr ? "المدونة" : "Blog",
      desc: isAr ? "كتابة وتحرير المقالات" : "Write and edit articles",
      href: "/admin/blog",
      color: "text-purple-300",
      ring: "ring-purple-400/20",
      bg: "bg-purple-400/10",
    },
    {
      icon: Mail,
      count: counts.messages,
      unread: counts.unreadMessages,
      label: isAr ? "الرسائل" : "Messages",
      desc: isAr ? "عرض رسائل التواصل" : "View contact messages",
      href: "/admin/messages",
      color: "text-emerald-300",
      ring: "ring-emerald-400/20",
      bg: "bg-emerald-400/10",
    },
    {
      icon: MapPin,
      unread: 0,
      count: counts.locations,
      label: isAr ? "المواقع" : "Locations",
      desc: isAr ? "إدارة المواقع الجغرافية" : "Manage office locations",
      href: "/admin/locations",
      color: "text-amber-300",
      ring: "ring-amber-400/20",
      bg: "bg-amber-400/10",
    },
  ];

  return (
    <AdminShell
      title={isAr ? "لوحة التحكم" : "Dashboard"}
      description={isAr ? "إدارة محتوى الموقع" : "Manage your site content"}
    >
      {error && (
        <div className="mb-6 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      {/* Content Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map(
          ({
            icon: Icon,
            count,
            unread,
            label,
            desc,
            href,
            color,
            ring,
            bg,
          }) => (
            <Link
              key={href}
              href={lang ? `${href}?lang=${lang}` : href}
              className="group rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <div className="relative">
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ring-1 ${bg} ${ring}`}
                  >
                    <Icon className={`h-5 w-5 ${color}`} strokeWidth={1.8} />
                  </span>
                  {/* ✅ Badge رسائل غير مقروءة */}
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                      {unread}
                    </span>
                  )}
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-600 transition-colors group-hover:text-white" />
              </div>
              {count !== null ? (
                <p className="mt-5 text-4xl font-semibold text-white">
                  {count}
                </p>
              ) : (
                <p className="mt-5 text-4xl font-semibold text-white">—</p>
              )}
              <p className="mt-1 text-base font-medium text-white">{label}</p>
              <p className="mt-0.5 text-sm text-slate-400">{desc}</p>
            </Link>
          ),
        )}
      </div>
    </AdminShell>
  );
}
