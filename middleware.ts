import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // المسارات العامة المسموحة
  const publicPaths = [
    "/admin/login",
    "/admin/reset-password",
    "/admin/forgot-password",
  ];
  const isPublic = publicPaths.some((path) => pathname.startsWith(path));

  if (isPublic) {
    return NextResponse.next();
  }

  // التحقق من الكوكي
  const token = request.cookies.get("ejaf_token")?.value;

  if (!token) {
    const loginUrl = new URL("/admin/login", request.url);
    const lang = request.nextUrl.searchParams.get("lang");
    if (lang) loginUrl.searchParams.set("lang", lang);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // اختيارياً: التحقق من صلاحية التوكن مع Laravel
  // يمكن إضافة هذا لاحقاً لتحسين الأمان

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
