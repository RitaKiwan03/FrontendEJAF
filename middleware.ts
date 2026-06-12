import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicPaths = ["/admin/login", "/admin/reset-password"];
  const isPublic = publicPaths.some((path) => pathname.startsWith(path));
  if (isPublic) return NextResponse.next();

  // تحقق من الـ cookie أو الـ header
  const cookieToken = request.cookies.get("ejaf_token")?.value;

  if (!cookieToken) {
    const loginUrl = new URL("/admin/login", request.url);
    const lang = request.nextUrl.searchParams.get("lang");
    if (lang) loginUrl.searchParams.set("lang", lang);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
