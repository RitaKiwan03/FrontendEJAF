import { NextResponse } from "next/server";
import { getBlogPosts } from "@/data/blog";
import { resolveLocale } from "@/lib/i18n";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "no-store",
};

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = resolveLocale(searchParams.get("lang"));
  return NextResponse.json(getBlogPosts(locale), { headers: CORS });
}

/**
 * POST /api/blog
 * Expected body (JSON):
 * {
 *   title_en: string
 *   title_ar: string
 *   excerpt_en: string
 *   excerpt_ar: string
 *   content_en: string
 *   content_ar: string
 *   slug: string
 *   image: string
 *   tags: string[]       // array of strings
 *   createdAt: string    // ISO 8601 e.g. "2024-01-15"
 * }
 * Returns: { id: string, ...body }
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400, headers: CORS });
  // TODO: validate and persist to database
  return NextResponse.json({ ...body, id: `post-${Date.now()}` }, { status: 201, headers: CORS });
}
