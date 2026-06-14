import { NextRequest, NextResponse } from "next/server";
import { requireAuth, isNextResponse } from "@/lib/apiAuth";
import { publishExisting } from "@/lib/surveillance/bundleService";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;

  const { id } = await params;
  try {
    await publishExisting(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "No se pudo publicar" },
      { status: 400 }
    );
  }
}
