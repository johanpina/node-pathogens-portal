import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isNextResponse } from "@/lib/apiAuth";
import { validateChartInput } from "../route";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;
  const { id } = await params;
  const chart = await prisma.pathogenChart.findUnique({ where: { id } });
  if (!chart) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(chart);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;
  const { id } = await params;
  const body = await request.json();
  const err = validateChartInput(body);
  if (err) return NextResponse.json({ error: err }, { status: 400 });

  const chart = await prisma.pathogenChart.update({
    where: { id },
    data: {
      pathogenId: body.pathogenId,
      order: Number(body.order) || 0,
      kind: body.kind,
      titleEs: body.titleEs,
      titleEn: body.titleEn,
      config: body.config,
      narrativeEs: body.narrativeEs || null,
      narrativeEn: body.narrativeEn || null,
    },
  });
  return NextResponse.json(chart);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;
  const { id } = await params;
  await prisma.pathogenChart.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
