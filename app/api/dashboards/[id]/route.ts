import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isNextResponse } from "@/lib/apiAuth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dashboard = await prisma.dashboard.findUnique({
    where: { id },
    include: { topics: { include: { topic: true } } },
  });
  if (!dashboard) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(dashboard);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;

  const { id } = await params;
  const body = await request.json();
  const { title, description, banner, redirectUrl, content, published, topicIds } = body;

  await prisma.dashboardTopic.deleteMany({ where: { dashboardId: id } });

  const dashboard = await prisma.dashboard.update({
    where: { id },
    data: {
      title,
      description: description ?? null,
      banner: banner ?? null,
      redirectUrl: redirectUrl ?? null,
      content: content ?? null,
      published,
      topics: topicIds?.length
        ? { create: topicIds.map((topicId: string) => ({ topicId })) }
        : undefined,
    },
    include: { topics: { include: { topic: true } } },
  });

  return NextResponse.json(dashboard);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;

  const { id } = await params;
  await prisma.dashboard.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
