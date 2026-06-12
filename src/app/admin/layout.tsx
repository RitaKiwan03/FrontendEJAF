import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const token = cookieStore.get("ejaf_token");

  // إذا لم يكن هناك توكن، حوّل فوراً لصفحة الدخول
  if (!token) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
