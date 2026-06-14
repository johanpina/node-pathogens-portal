import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isNextResponse } from "@/lib/apiAuth";
import { diffAgainstLive } from "@/lib/surveillance/bundleService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;

  const { id } = await params;
  const bundle = await prisma.pathogenBundle.findUnique({ where: { id } });
  if (!bundle) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const diff = await diffAgainstLive(bundle.parsedJson as Record<string, unknown>);
  return NextResponse.json({ bundle, diff });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;

  const { id } = await params;
  const bundle = await prisma.pathogenBundle.findUnique({ where: { id } });
  if (!bundle) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  if (bundle.status === "PUBLISHED") {
    return NextResponse.json(
      { error: "No se puede borrar el bundle publicado; haz rollback primero" },
      { status: 409 }
    );
  }

  await prisma.pathogenBundle.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
