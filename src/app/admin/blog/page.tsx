"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { AdminBlogCrud } from "@/components/admin-blog-crud";
import { getAdminPosts } from "@/lib/admin-api";

export default function AdminBlogPage() {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang");
  const isAr = lang === "ar";

  const [initial, setInitial] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ يجلب البيانات من Client مع التوكن
    getAdminPosts()
      .then((data: any[]) => {
        const mapped = data.map((p: any) => ({
          id: String(p.id),
          title_en: p.title_en ?? "",
          title_ar: p.title_ar ?? "",
          excerpt_en: p.excerpt_en ?? "",
          excerpt_ar: p.excerpt_ar ?? "",
          content_en: p.content_en ?? "",
          content_ar: p.content_ar ?? "",
          slug: p.slug ?? "",
          image: p.image ?? "",
          tags:
            p.tags && typeof p.tags === "object" ? p.tags : { en: "", ar: "" },
          createdAt: p.createdAt ?? p.created_at_display ?? "",
          status: p.status ?? "published",
        }));
        setInitial(mapped);
      })
      .catch(() => setInitial([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminShell
        title={isAr ? "المدونة" : "Blog"}
        description={
          isAr
            ? "كتابة وتحرير ونشر المقالات"
            : "Write, edit and publish articles"
        }
      >
        <div className="flex justify-center py-20">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title={isAr ? "المدونة" : "Blog"}
      description={
        isAr ? "كتابة وتحرير ونشر المقالات" : "Write, edit and publish articles"
      }
    >
      <AdminBlogCrud initial={initial} isAr={isAr} />
    </AdminShell>
  );
}
