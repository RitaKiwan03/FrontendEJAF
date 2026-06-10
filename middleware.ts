import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("ejaf_token")?.value;
  const pathname = request.nextUrl.pathname;

  const isPublicPage =
    pathname === "/admin/login" || pathname === "/admin/signup";
  const hasValidToken = !!token && token.trim() !== "";

  // 1. إذا كان المستخدم يحاول دخول صفحة عامة (Login) وهو مسجل مسبقاً، وجهه للـ Dashboard
  if (isPublicPage && hasValidToken) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // 2. إذا كان يحاول دخول صفحة محمية (أي شيء يبدأ بـ /admin/ ولا يساوي login) وليس لديه توكن
  if (!isPublicPage && !hasValidToken) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
