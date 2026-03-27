import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isNextResponse } from "@/lib/apiAuth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(event);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;

  const { id } = await params;
  const body = await request.json();

  const event = await prisma.event.update({
    where: { id },
    data: {
      title: body.title,
      type: body.type,
      dateStart: body.dateStart ? new Date(body.dateStart) : undefined,
      timeStart: body.timeStart ?? null,
      dateEnd: body.dateEnd ? new Date(body.dateEnd) : null,
      timeEnd: body.timeEnd ?? null,
      venue: body.venue ?? null,
      organisers: body.organisers ?? null,
      eventUrl: body.eventUrl,
      description: body.description ?? null,
    },
  });

  return NextResponse.json(event);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;

  const { id } = await params;
  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
