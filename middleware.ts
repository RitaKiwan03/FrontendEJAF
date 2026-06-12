import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ الصفحات العامة - لا تحتاج token
  const publicPaths = ["/admin/login", "/admin/reset-password"];

  const isPublic = publicPaths.some((path) => pathname.startsWith(path));

  if (isPublic) return NextResponse.next();

  // ✅ التحقق من الـ token
  const cookieToken = request.cookies.get("ejaf_token")?.value;
  const hasToken = !!cookieToken;

  // ✅ إذا لا يوجد token - أعد التوجيه لـ Login
  if (!hasToken) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
