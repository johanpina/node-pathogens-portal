import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isNextResponse } from "@/lib/apiAuth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const news = await prisma.news.findUnique({ where: { id } });
  if (!news) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(news);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;

  const { id } = await params;
  const body = await request.json();
  const { title, date, summary, banner, bannerLarge, bannerCaption, content, published } = body;

  const news = await prisma.news.update({
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
    },
  });

  return NextResponse.json(news);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;

  const { id } = await params;
  await prisma.news.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
