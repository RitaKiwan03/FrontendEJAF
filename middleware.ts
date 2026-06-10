import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("ejaf_token");
  const { pathname } = request.nextUrl;

  // 1. تعريف الصفحات العامة
  const isLoginPage = pathname === "/admin/login";

  // 2. التحقق من وجود التوكن
  const hasToken = !!token?.value;

  // 3. إذا كان المستخدم لا يملك توكن ويحاول دخول أي صفحة admin غير الـ login
  if (!hasToken && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // 4. إذا كان المستخدم يملك توكن ويحاول دخول صفحة الـ login، وجهه للداشبورد
  if (hasToken && isLoginPage) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
