import { cookies } from "next/headers";
import { AdminShell } from "@/components/admin-shell";
import { AdminProjectsCrud } from "@/components/admin-projects-crud";
import { resolveLocale } from "@/lib/i18n";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
type Props = { searchParams?: { lang?: string } };

export default async function AdminProjectsPage({ searchParams }: Props) {
  const locale = resolveLocale(searchParams?.lang);
  const isAr = locale === "ar";
  const cookieStore = cookies();
  const token = cookieStore.get("ejaf_token")?.value ?? "";
  let initial: any[] = [];
  try {
    const res = await fetch(`${API_URL}/api/admin/projects`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.ok) {
      const data = await res.json();
      initial = data.map((p: any) => ({
        id: String(p.id),
        title_en: p.title_en ?? "",
        title_ar: p.title_ar ?? "",
        description_en: p.description_en ?? "",
        description_ar: p.description_ar ?? "",
        image: p.image ?? "",
        technologies: Array.isArray(p.technologies)
          ? p.technologies.join(", ")
          : (p.technologies?.en?.join(", ") ?? ""),
      }));
    }
  } catch (e) {
    console.error("Failed to fetch projects:", e);
  }
  return (
    <AdminShell
      title={isAr ? "المشاريع" : "Projects"}
      description={
        isAr
          ? "إدارة دراسات الحالة وصور الغلاف"
          : "Manage case studies and cover images"
      }
    >
      <AdminProjectsCrud initial={initial} isAr={isAr} />
    </AdminShell>
  );
}
