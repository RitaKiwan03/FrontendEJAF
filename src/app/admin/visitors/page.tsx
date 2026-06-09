"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Users, CalendarDays, TrendingUp, Loader2 } from "lucide-react";

import { AdminShell } from "@/components/admin-shell";
import { getVisitorStatsApi } from "@/lib/api";
import { isLoggedIn } from "@/lib/admin-api";

export default function AdminVisitorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang");
  const isAr = lang === "ar";

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    this_month: 0,
    this_year: 0,
  });

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push(lang ? `/admin/login?lang=${lang}` : "/admin/login");
      return;
    }

    async function fetchStats() {
      const data = await getVisitorStatsApi().catch(() => null);
      if (data) {
        setStats({
          total: data.total,
          this_month: data.this_month,
          this_year: data.this_year,
        });
      }
      setLoading(false);
    }

    fetchStats();
  }, [lang, router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-300" />
      </div>
    );
  }

  const cards = [
    {
      icon: Users,
      count: stats.total,
      label: isAr ? "إجمالي الزوار" : "Total Visitors",
      desc: isAr ? "منذ إطلاق الموقع" : "Since site launch",
      color: "text-sky-300",
      ring: "ring-sky-400/20",
      bg: "bg-sky-400/10",
    },
    {
      icon: CalendarDays,
      count: stats.this_month,
      label: isAr ? "زوار هذا الشهر" : "This Month",
      desc: isAr ? "الشهر الحالي" : "Current month visitors",
      color: "text-violet-300",
      ring: "ring-violet-400/20",
      bg: "bg-violet-400/10",
    },
    {
      icon: TrendingUp,
      count: stats.this_year,
      label: isAr ? "زوار هذه السنة" : "This Year",
      desc: isAr ? "السنة الحالية" : "Current year visitors",
      color: "text-fuchsia-300",
      ring: "ring-fuchsia-400/20",
      bg: "bg-fuchsia-400/10",
    },
  ];

  return (
    <AdminShell
      title={isAr ? "إحصائيات الزوار" : "Visitor Statistics"}
      description={isAr ? "تتبع زوار الموقع" : "Track your site visitors"}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(({ icon: Icon, count, label, desc, color, ring, bg }) => (
          <div
            key={label}
            className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-6"
          >
            <span
              className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ring-1 ${bg} ${ring}`}
            >
              <Icon className={`h-5 w-5 ${color}`} strokeWidth={1.8} />
            </span>
            <p className="mt-5 text-4xl font-semibold text-white">{count}</p>
            <p className="mt-1 text-base font-medium text-white">{label}</p>
            <p className="mt-0.5 text-sm text-slate-400">{desc}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
