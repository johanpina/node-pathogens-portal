import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isNextResponse } from "@/lib/apiAuth";
import { PATHOGEN_IDS } from "@/lib/surveillance/schemas";

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

export function validateChartInput(body: Record<string, unknown>): string | null {
  if (!PATHOGEN_IDS.includes(body.pathogenId as never)) return "pathogenId inválido";
  if (!["line", "bar", "doughnut", "pie"].includes(body.kind as string)) return "kind inválido";
  if (!body.titleEs || !body.titleEn) return "Falta título (es/en)";
  const cfg = body.config as { data?: unknown } | undefined;
  if (!cfg || typeof cfg !== "object" || !cfg.data) return "config debe incluir 'data'";
  return null;
}
