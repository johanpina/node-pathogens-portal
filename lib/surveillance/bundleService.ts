import { prisma } from "@/lib/db";
import { parseBundle } from "./parseBundle";
import { validateBundle, type FileValidationError } from "./schemas";
import { applyBundleTx } from "./applyBundle";
import { diffBundles } from "./diffBundle";
import type { BundleSource } from "@prisma/client";

export interface IngestResult {
  files: Record<string, unknown>;
  fileCount: number;
  jsonErrors: { file: string; error: string }[];
  validationErrors: FileValidationError[];
  valid: boolean;
  epiWeek: string | null;
}

/** Parse + validate a markdown bundle (or a pre-parsed file map). Never applies. */
export function ingestMarkdown(markdown: string): IngestResult {
  const { files, jsonErrors } = parseBundle(markdown);
  return finishIngest(files, jsonErrors);
}

export function ingestFiles(files: Record<string, unknown>): IngestResult {
  return finishIngest(files, []);
}

function finishIngest(
  files: Record<string, unknown>,
  jsonErrors: { file: string; error: string }[]
): IngestResult {
  const validationErrors = validateBundle(files);
  const meta = files["data/curated/meta.json"] as { epi_week?: string } | undefined;
  const pathogens = files["data/curated/pathogens.json"] as { epi_week?: string } | undefined;
  return {
    files,
    fileCount: Object.keys(files).length,
    jsonErrors,
    validationErrors,
    valid: jsonErrors.length === 0 && validationErrors.length === 0 && Object.keys(files).length > 0,
    epiWeek: meta?.epi_week ?? pathogens?.epi_week ?? null,
  };
}

/** Return the currently published bundle's file map, or {} if none. */
export async function liveFiles(): Promise<Record<string, unknown>> {
  const published = await prisma.pathogenBundle.findFirst({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });
  return (published?.parsedJson as Record<string, unknown>) ?? {};
}

/** Diff a candidate file map against the live published bundle. */
export async function diffAgainstLive(files: Record<string, unknown>) {
  return diffBundles(await liveFiles(), files);
}

/**
 * Apply a validated file map to the live tables, record it as a PUBLISHED
 * bundle, and archive the previous published bundle — all atomically.
 */
export async function publishFiles(opts: {
  files: Record<string, unknown>;
  source: BundleSource;
  rawMarkdown?: string | null;
  epiWeek?: string | null;
  createdById?: string | null;
}): Promise<string> {
  const errors = validateBundle(opts.files);
  if (errors.length) {
    throw new Error(`bundle inválido: ${errors.map((e) => e.file).join(", ")}`);
  }
  return prisma.$transaction(async (tx) => {
    await tx.pathogenBundle.updateMany({
      where: { status: "PUBLISHED" },
      data: { status: "ARCHIVED" },
    });
    await applyBundleTx(tx, opts.files);
    const bundle = await tx.pathogenBundle.create({
      data: {
        status: "PUBLISHED",
        source: opts.source,
        epiWeek: opts.epiWeek ?? null,
        rawMarkdown: opts.rawMarkdown ?? null,
        parsedJson: opts.files as object,
        createdById: opts.createdById ?? null,
        publishedAt: new Date(),
      },
    });
    return bundle.id;
  });
}

/** Promote an existing (e.g. draft or archived) bundle to PUBLISHED. */
export async function publishExisting(bundleId: string): Promise<void> {
  const bundle = await prisma.pathogenBundle.findUniqueOrThrow({ where: { id: bundleId } });
  const files = bundle.parsedJson as Record<string, unknown>;
  const errors = validateBundle(files);
  if (errors.length) {
    throw new Error(`bundle inválido: ${errors.map((e) => e.file).join(", ")}`);
  }
  await prisma.$transaction(async (tx) => {
    await tx.pathogenBundle.updateMany({
      where: { status: "PUBLISHED", id: { not: bundleId } },
      data: { status: "ARCHIVED" },
    });
    await applyBundleTx(tx, files);
    await tx.pathogenBundle.update({
      where: { id: bundleId },
      data: { status: "PUBLISHED", publishedAt: new Date() },
    });
  });
}
