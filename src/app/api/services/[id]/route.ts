import { NextResponse } from "next/server";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "no-store",
};

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

/**
 * PUT /api/services/:id
 * Expected body (JSON):
 * {
 *   title_en: string
 *   title_ar: string
 *   description_en: string
 *   description_ar: string
 *   icon: string
 *   gif?: string
 * }
 */
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400, headers: CORS });
  // TODO: validate and update record in database
  return NextResponse.json({ ...body, id: params.id }, { headers: CORS });
}

/**
 * DELETE /api/services/:id
 */
export function DELETE(_request: Request, { params }: { params: { id: string } }) {
  // TODO: delete record from database
  return NextResponse.json({ deleted: true, id: params.id }, { headers: CORS });
}
