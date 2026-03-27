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

  const dashboards = await prisma.dashboard.findMany({
    where,
    orderBy: { title: "asc" },
    include: { topics: { include: { topic: true } } },
  });

  return NextResponse.json(dashboards);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;

  const body = await request.json();
  const { title, description, banner, redirectUrl, content, published, topicIds } = body;

  if (!title) {
    return NextResponse.json({ error: "Título requerido" }, { status: 400 });
  }

  const slug = slugify(title);

  try {
    const dashboard = await prisma.dashboard.create({
      data: {
        title,
        slug,
        description: description || null,
        banner: banner || null,
        redirectUrl: redirectUrl || null,
        content: content || null,
        published: published ?? false,
        topics: topicIds?.length
          ? { create: topicIds.map((topicId: string) => ({ topicId })) }
          : undefined,
      },
      include: { topics: { include: { topic: true } } },
    });
    return NextResponse.json(dashboard, { status: 201 });
  } catch {
    return NextResponse.json({ error: "El slug ya existe" }, { status: 409 });
  }
}
