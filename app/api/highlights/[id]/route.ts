import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isNextResponse } from "@/lib/apiAuth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const highlight = await prisma.highlight.findUnique({
    where: { id },
    include: { topics: { include: { topic: true } } },
  });
  if (!highlight) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(highlight);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;

  const { id } = await params;
  const body = await request.json();
  const { title, date, summary, banner, bannerLarge, bannerCaption, content, published, tags, topicIds } = body;

  // Update topics: delete all then recreate
  await prisma.highlightTopic.deleteMany({ where: { highlightId: id } });

  const highlight = await prisma.highlight.update({
    where: { id },
    data: {
      title,
      date: date ? new Date(date) : undefined,
      summary,
      banner: banner ?? null,
      bannerLarge: bannerLarge ?? null,
      bannerCaption: bannerCaption ?? null,
      content,
      published,
      tags: tags ?? [],
      topics: topicIds?.length
        ? { create: topicIds.map((topicId: string) => ({ topicId })) }
        : undefined,
    },
    include: { topics: { include: { topic: true } } },
  });

  return NextResponse.json(highlight);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;

  const { id } = await params;
  await prisma.highlight.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
