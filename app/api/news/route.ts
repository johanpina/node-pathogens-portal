import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isNextResponse } from "@/lib/apiAuth";
import { slugify } from "@/lib/slugify";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const publishedOnly = searchParams.get("published") !== "false";

  const news = await prisma.news.findMany({
    where: publishedOnly ? { published: true } : {},
    orderBy: { date: "desc" },
  });

  return NextResponse.json(news);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;

  const body = await request.json();
  const { title, date, summary, banner, bannerLarge, bannerCaption, content, published } = body;

  if (!title || !date || !summary || !content) {
    return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 });
  }

  const slug = slugify(title);

  try {
    const news = await prisma.news.create({
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
      },
    });
    return NextResponse.json(news, { status: 201 });
  } catch {
    return NextResponse.json({ error: "El slug ya existe" }, { status: 409 });
  }
}
