import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isNextResponse } from "@/lib/apiAuth";
import { ingestMarkdown, ingestFiles } from "@/lib/surveillance/bundleService";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;

  const bundles = await prisma.pathogenBundle.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      source: true,
      epiWeek: true,
      validationErrors: true,
      publishedAt: true,
      createdAt: true,
    },
  });
  return NextResponse.json(bundles);
}

/**
 * Ingest a bundle (markdown paste or pre-parsed json map). Parses + validates
 * but NEVER applies to live. Stores it as REVIEW (valid) or DRAFT (has errors).
 */
export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isNextResponse(auth)) return auth;

  const body = await request.json();
  const markdown: string | undefined = body.markdown;
  const json: Record<string, unknown> | undefined = body.json;

  if (!markdown && !json) {
    return NextResponse.json({ error: "Falta 'markdown' o 'json'" }, { status: 400 });
  }

  const result = markdown ? ingestMarkdown(markdown) : ingestFiles(json!);
  const errors = [
    ...result.jsonErrors.map((e) => ({ file: e.file, errors: [e.error] })),
    ...result.validationErrors,
  ];

  const bundle = await prisma.pathogenBundle.create({
    data: {
      status: result.valid ? "REVIEW" : "DRAFT",
      source: "MANUAL_IMPORT",
      epiWeek: result.epiWeek,
      rawMarkdown: markdown ?? null,
      parsedJson: result.files as object,
      validationErrors: errors.length ? (errors as object) : undefined,
      createdById: auth.user.sub,
    },
  });

  return NextResponse.json({
    id: bundle.id,
    status: bundle.status,
    valid: result.valid,
    fileCount: result.fileCount,
    epiWeek: result.epiWeek,
    errors,
  });
}
