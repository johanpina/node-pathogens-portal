import { readFileSync } from "node:fs";
import { join } from "node:path";
import { prisma } from "@/lib/db";
import { ingestMarkdown, publishFiles } from "@/lib/surveillance/bundleService";

/** Maps each pathogen to an existing Topic slug (optional cross-link). */
const PATHOGEN_TOPIC: Record<string, string> = {
  influenza: "respiratory-viruses",
  rsv: "respiratory-viruses",
  covid19: "respiratory-viruses",
  hantavirus: "vector-borne-diseases",
  dengue: "vector-borne-diseases",
  mpox: "emerging-pathogens",
  salmonella: "foodborne-pathogens",
  amr: "antimicrobial-resistance",
};

export async function seedPathogens() {
  const bundlePath = join(process.cwd(), "prisma", "data", "bundle_SE22_2026.md");
  const markdown = readFileSync(bundlePath, "utf-8");

  const ingest = ingestMarkdown(markdown);
  if (!ingest.valid) {
    console.error("Pathogen seed bundle is invalid:");
    for (const e of ingest.validationErrors) console.error(`  ${e.file}: ${e.errors.join("; ")}`);
    for (const e of ingest.jsonErrors) console.error(`  ${e.file}: ${e.error}`);
    throw new Error("invalid seed bundle");
  }

  await publishFiles({
    files: ingest.files,
    source: "MANUAL_IMPORT",
    rawMarkdown: markdown,
    epiWeek: ingest.epiWeek,
  });
  console.log(`Published pathogen bundle (${ingest.epiWeek ?? "?"}), ${ingest.fileCount} files`);

  // Cross-link pathogens to existing topics (best-effort).
  const topics = await prisma.topic.findMany({ select: { id: true, slug: true } });
  const bySlug = Object.fromEntries(topics.map((t) => [t.slug, t.id]));
  for (const [pid, slug] of Object.entries(PATHOGEN_TOPIC)) {
    const topicId = bySlug[slug];
    if (!topicId) continue;
    await prisma.pathogen.update({ where: { id: pid }, data: { topicId } }).catch(() => {});
  }
  console.log("Linked pathogens to topics");
}

// Allow standalone execution: `pnpm tsx prisma/seedPathogens.ts`
if (process.argv[1] && process.argv[1].includes("seedPathogens")) {
  seedPathogens()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
