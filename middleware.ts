import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("ejaf_token")?.value;
    const pathname = request.nextUrl.pathname;

    // الصفحات المسموحة بدون تسجيل دخول
    const publicAdminPages = ["/admin/login", "/admin/signup"];

    // التحقق من وجود token صحيح
    const hasValidToken = !!token && token.trim() !== "";

    // إذا كانت صفحة محمية وليس هناك token صحيح
    const isProtectedPage = !publicAdminPages.includes(pathname);

    if (isProtectedPage && !hasValidToken) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
