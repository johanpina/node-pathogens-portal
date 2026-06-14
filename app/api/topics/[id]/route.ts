import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isNextResponse } from "@/lib/apiAuth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const topic = await prisma.topic.findUnique({ where: { id } });
  if (!topic) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(topic);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;

  const { id } = await params;
  const body = await request.json();

  const topic = await prisma.topic.update({
    where: { id },
    data: {
      name: body.name,
      nameEn: body.nameEn ?? null,
      description: body.description ?? null,
      descriptionEn: body.descriptionEn ?? null,
      banner: body.banner ?? null,
      bannerCaption: body.bannerCaption ?? null,
      menuOrder: body.menuOrder ?? 0,
    },
  });

  return NextResponse.json(topic);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;

  const { id } = await params;
  await prisma.topic.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
