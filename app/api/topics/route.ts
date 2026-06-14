import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isNextResponse } from "@/lib/apiAuth";
import { slugify } from "@/lib/slugify";

export async function GET() {
  const topics = await prisma.topic.findMany({
    orderBy: { menuOrder: "asc" },
    include: {
      _count: { select: { highlights: true, dashboards: true } },
    },
  });
  return NextResponse.json(topics);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;

  const body = await request.json();
  const { name, nameEn, description, descriptionEn, banner, bannerCaption, menuOrder } = body;

  if (!name) {
    return NextResponse.json({ error: "Nombre requerido" }, { status: 400 });
  }

  const slug = slugify(name);

  try {
    const topic = await prisma.topic.create({
      data: {
        name,
        nameEn: nameEn || null,
        slug,
        description: description || null,
        descriptionEn: descriptionEn || null,
        banner: banner || null,
        bannerCaption: bannerCaption || null,
        menuOrder: menuOrder ?? 0,
      },
    });
    return NextResponse.json(topic, { status: 201 });
  } catch {
    return NextResponse.json({ error: "El slug ya existe" }, { status: 409 });
  }
}
