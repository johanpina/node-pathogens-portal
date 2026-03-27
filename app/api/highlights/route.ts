import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isNextResponse } from "@/lib/apiAuth";
import { slugify } from "@/lib/slugify";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const publishedOnly = searchParams.get("published") !== "false";
  const topicSlug = searchParams.get("topic");

  const where: Record<string, unknown> = publishedOnly ? { published: true } : {};
  if (topicSlug) {
    where.topics = { some: { topic: { slug: topicSlug } } };
  }

  const highlights = await prisma.highlight.findMany({
    where,
    orderBy: { date: "desc" },
    include: { topics: { include: { topic: true } } },
  });

  return NextResponse.json(highlights);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;

  const body = await request.json();
  const { title, date, summary, banner, bannerLarge, bannerCaption, content, published, tags, topicIds } = body;

  if (!title || !date || !summary || !content) {
    return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 });
  }

  const slug = slugify(title);

  try {
    const highlight = await prisma.highlight.create({
      data: {
        title,
        slug,
        date: new Date(date),
        summary,
        banner: banner || null,
        bannerLarge: bannerLarge || null,
        bannerCaption: bannerCaption || null,
        content,
        published: published ?? false,
        tags: tags ?? [],
        topics: topicIds?.length
          ? { create: topicIds.map((topicId: string) => ({ topicId })) }
          : undefined,
      },
      include: { topics: { include: { topic: true } } },
    });
    return NextResponse.json(highlight, { status: 201 });
  } catch {
    return NextResponse.json({ error: "El slug ya existe" }, { status: 409 });
  }
}
