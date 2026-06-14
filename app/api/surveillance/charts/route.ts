import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isNextResponse } from "@/lib/apiAuth";
import { validateChartInput } from "@/lib/surveillance/chartInput";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;

  const pathogenId = request.nextUrl.searchParams.get("pathogenId") ?? undefined;
  const charts = await prisma.pathogenChart.findMany({
    where: pathogenId ? { pathogenId } : {},
    orderBy: [{ pathogenId: "asc" }, { order: "asc" }],
  });
  return NextResponse.json(charts);
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;

  const body = await request.json();
  const err = validateChartInput(body);
  if (err) return NextResponse.json({ error: err }, { status: 400 });

  const chart = await prisma.pathogenChart.create({
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
