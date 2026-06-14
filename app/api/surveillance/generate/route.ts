import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, isNextResponse } from "@/lib/apiAuth";
import { generateBundle } from "@/lib/surveillance/generateBundle";
import { ingestMarkdown, diffAgainstLive } from "@/lib/surveillance/bundleService";

export const maxDuration = 300; // web search + generation can take minutes

/**
 * Generate a weekly draft with Claude + web search. Auth: a logged-in admin
 * session OR a matching `x-cron-secret` header (for the external weekly cron).
 * Never publishes — a valid draft lands as REVIEW for a human to approve.
 * `?dryRun=true` validates without persisting.
 */
export async function POST(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const headerSecret = request.headers.get("x-cron-secret");
  const viaCron = !!cronSecret && headerSecret === cronSecret;

  let createdById: string | null = null;
  if (!viaCron) {
    const auth = await requireAuth(request);
    if (isNextResponse(auth)) return auth;
    createdById = auth.user.sub;
  }

  const dryRun = request.nextUrl.searchParams.get("dryRun") === "true";

  let generated;
  try {
    generated = await generateBundle();
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error al generar" },
      { status: 500 }
    );
  }

  const ingest = ingestMarkdown(generated.markdown);
  const errors = [
    ...ingest.jsonErrors.map((e) => ({ file: e.file, errors: [e.error] })),
    ...ingest.validationErrors,
  ];

  if (dryRun) {
    const diff = await diffAgainstLive(ingest.files);
    return NextResponse.json({
      dryRun: true,
      epiWeek: ingest.epiWeek ?? generated.epiWeek,
      valid: ingest.valid,
      fileCount: ingest.fileCount,
      errors,
      diff,
      markdown: generated.markdown,
    });
  }

  const bundle = await prisma.pathogenBundle.create({
    data: {
      status: ingest.valid ? "REVIEW" : "DRAFT",
      source: "AI_GENERATED",
      epiWeek: ingest.epiWeek ?? generated.epiWeek,
      rawMarkdown: generated.markdown,
      parsedJson: ingest.files as object,
      validationErrors: errors.length ? (errors as object) : undefined,
      createdById,
    },
  });

  return NextResponse.json({
    id: bundle.id,
    status: bundle.status,
    valid: ingest.valid,
    fileCount: ingest.fileCount,
    epiWeek: bundle.epiWeek,
    errors,
  });
}
