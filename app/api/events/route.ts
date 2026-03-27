import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isNextResponse } from "@/lib/apiAuth";

export async function GET() {
  const events = await prisma.event.findMany({
    orderBy: { dateStart: "asc" },
  });
  return NextResponse.json(events);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;

  const body = await request.json();
  const { title, type, dateStart, timeStart, dateEnd, timeEnd, venue, organisers, eventUrl, description } = body;

  if (!title || !dateStart || !eventUrl) {
    return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 });
  }

  const event = await prisma.event.create({
    data: {
      title,
      type: type || "Event",
      dateStart: new Date(dateStart),
      timeStart: timeStart || null,
      dateEnd: dateEnd ? new Date(dateEnd) : null,
      timeEnd: timeEnd || null,
      venue: venue || null,
      organisers: organisers || null,
      eventUrl,
      description: description || null,
    },
  });

  return NextResponse.json(event, { status: 201 });
}
