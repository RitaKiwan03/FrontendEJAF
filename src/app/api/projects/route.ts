import { NextResponse } from "next/server";
import { getProjects } from "@/data/projects";
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
  return NextResponse.json(getProjects(locale), { headers: CORS });
}

/**
 * POST /api/projects
 * Expected body (JSON):
 * {
 *   title_en: string
 *   title_ar: string
 *   description_en: string
 *   description_ar: string
 *   image: string
 *   technologies: string[]   // array of strings
 * }
 * Returns: { id: string, ...body }
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400, headers: CORS });
  // TODO: validate and persist to database
  return NextResponse.json({ ...body, id: `prj-${Date.now()}` }, { status: 201, headers: CORS });
}
