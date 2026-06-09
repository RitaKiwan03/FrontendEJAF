import { AdminShell } from "@/components/admin-shell";
import { AdminServicesCrud } from "@/components/admin-services-crud";
import { resolveLocale } from "@/lib/i18n";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type Props = { searchParams?: { lang?: string } };

export default async function AdminServicesPage({ searchParams }: Props) {
  const locale = resolveLocale(searchParams?.lang);
  const isAr = locale === "ar";

  let initial: any[] = [];

  try {
    const res = await fetch(`${API_URL}/api/admin/services`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      initial = data.map((s: any) => ({
        id: String(s.id),
        title_en: s.title_en ?? "",
        title_ar: s.title_ar ?? "",
        description_en: s.description_en ?? "",
        description_ar: s.description_ar ?? "",
        icon: s.icon ?? "server",
        gif: s.gif ?? "",
      }));
    }
  } catch (e) {
    console.error("Failed to fetch services:", e);
  }

  return (
    <AdminShell
      title={isAr ? "الخدمات" : "Services"}
      description={
        isAr
          ? "إنشاء وتعديل وحذف سجلات الخدمات"
          : "Create, edit and delete service records"
      }
    >
      <AdminServicesCrud initial={initial} isAr={isAr} />
    </AdminShell>
  );
}
