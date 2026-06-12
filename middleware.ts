import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ تجاهل صفحة Login وReset Password
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/reset-password")
  ) {
    return NextResponse.next();
  }

  // ✅ التحقق من الـ token بطرق متعددة
  const cookieToken = request.cookies.get("ejaf_token")?.value;
  const authHeader = request.headers.get("authorization");

  const hasToken = !!cookieToken || !!authHeader;

  // ✅ إذا لا يوجد token - أعد التوجيه لـ Login
  if (!hasToken) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
