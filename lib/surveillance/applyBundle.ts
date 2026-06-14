import { prisma } from "@/lib/db";
import type { Prisma, PrismaClient } from "@prisma/client";
import {
  type MetaFile,
  type BannerFile,
  type PathogensFile,
  type HighlightsFile,
  type NewsFile,
  type PathogenDetail,
  metaFileSchema,
  bannerFileSchema,
  pathogensFileSchema,
  highlightsFileSchema,
  newsFileSchema,
  pathogenDetailSchema,
} from "./schemas";

type Tx = Prisma.TransactionClient | PrismaClient;

/**
 * Apply a validated bundle to the live surveillance tables.
 *
 * Partial-merge semantics (like Javier's seeded staging): only the entities
 * present in `files` are touched; anything omitted keeps its current value.
 * Runs inside a single transaction so a failure leaves the live data intact.
 */
export async function applyBundle(files: Record<string, unknown>): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await applyBundleTx(tx, files);
  });
}

/** Same as applyBundle but joins an existing transaction. */
export async function applyBundleTx(tx: Tx, files: Record<string, unknown>): Promise<void> {
  {
    if (files["data/curated/meta.json"]) {
      await applyMeta(tx, metaFileSchema.parse(files["data/curated/meta.json"]));
    }
    if (files["data/curated/banner_stats.json"]) {
      await applyBanner(tx, bannerFileSchema.parse(files["data/curated/banner_stats.json"]));
    }
    if (files["data/curated/pathogens.json"]) {
      await applyPathogens(tx, pathogensFileSchema.parse(files["data/curated/pathogens.json"]));
    }
    if (files["data/curated/highlights.json"]) {
      await applyHighlights(tx, highlightsFileSchema.parse(files["data/curated/highlights.json"]));
    }
    if (files["data/curated/news.json"]) {
      await applyNews(tx, newsFileSchema.parse(files["data/curated/news.json"]));
    }
    for (const [rel, json] of Object.entries(files)) {
      const m = rel.match(/pathogens\/([a-z0-9]+)\.json$/);
      if (m) await applyDetail(tx, m[1], pathogenDetailSchema.parse(json));
    }
  }
}

async function applyMeta(tx: Tx, meta: MetaFile) {
  const data = {
    schemaVersion: meta.schema_version,
    epiWeek: meta.epi_week,
    ew: meta.ew,
    year: meta.year,
    homeAlertEs: meta.home_alert.text_es,
    homeAlertEn: meta.home_alert.text_en,
    regionalLastCheck: meta.regional_context?.last_check ?? null,
    regionalSource: meta.regional_context?.source ?? null,
  };
  await tx.epiMeta.upsert({
    where: { id: "current" },
    update: data,
    create: { id: "current", ...data },
  });
}

async function applyBanner(tx: Tx, banner: BannerFile) {
  await tx.bannerStat.deleteMany({});
  await tx.bannerStat.createMany({
    data: banner.stats.map((s, i) => ({
      id: s.id,
      order: i,
      value: s.value,
      labelEs: s.label_es,
      labelEn: s.label_en,
    })),
  });
}

async function applyPathogens(tx: Tx, file: PathogensFile) {
  for (let i = 0; i < file.items.length; i++) {
    const p = file.items[i];
    const core = {
      nameEs: p.name_es,
      nameEn: p.name_en,
      icon: p.icon,
      color: p.color,
      status: p.status,
      statusLabelEs: p.status_label_es,
      statusLabelEn: p.status_label_en,
      summaryEs: p.summary_es,
      summaryEn: p.summary_en,
      cardSources: p.sources,
      page: p.page,
      epiWeek: file.epi_week,
      order: i,
    };
    await tx.pathogen.upsert({
      where: { id: p.id },
      update: core,
      create: { id: p.id, ...core },
    });
    // Replace this pathogen's card stats.
    await tx.pathogenStat.deleteMany({ where: { pathogenId: p.id, kind: "card" } });
    await tx.pathogenStat.createMany({
      data: p.stats.map((s, j) => ({
        pathogenId: p.id,
        kind: "card",
        order: j,
        value: s.value,
        labelEs: s.label_es,
        labelEn: s.label_en,
      })),
    });
  }
}

async function applyDetail(tx: Tx, id: string, detail: PathogenDetail) {
  // Update core notes/status; create a minimal pathogen if it doesn't exist yet.
  await tx.pathogen.upsert({
    where: { id },
    update: {
      status: detail.status,
      notesEs: detail.notes_es,
      notesEn: detail.notes_en,
    },
    create: {
      id,
      nameEs: id,
      nameEn: id,
      icon: "bi-virus",
      color: "#475569",
      status: detail.status,
      statusLabelEs: detail.status,
      statusLabelEn: detail.status,
      summaryEs: "",
      summaryEn: "",
      cardSources: [],
      notesEs: detail.notes_es,
      notesEn: detail.notes_en,
    },
  });
  await tx.pathogenStat.deleteMany({ where: { pathogenId: id, kind: "headline" } });
  await tx.pathogenStat.createMany({
    data: detail.headline_stats.map((s, j) => ({
      pathogenId: id,
      kind: "headline",
      order: j,
      statId: s.id ?? null,
      value: s.value,
      labelEs: s.label_es,
      labelEn: s.label_en,
    })),
  });
  await tx.pathogenSource.deleteMany({ where: { pathogenId: id } });
  await tx.pathogenSource.createMany({
    data: detail.sources.map((s, j) => ({
      pathogenId: id,
      sourceId: s.id,
      name: s.name,
      url: s.url ?? null,
      retrievedAt: s.retrieved_at ?? null,
      order: j,
    })),
  });
}

async function applyHighlights(tx: Tx, file: HighlightsFile) {
  await tx.surveillanceHighlight.deleteMany({});
  await tx.surveillanceHighlight.createMany({
    data: file.items.map((h, i) => ({
      id: h.id,
      order: i,
      titleEs: h.title_es,
      titleEn: h.title_en,
      metricValue: h.metric_value,
      metricLabelEs: h.metric_label_es,
      metricLabelEn: h.metric_label_en,
      link: h.link,
    })),
  });
}

async function applyNews(tx: Tx, file: NewsFile) {
  await tx.surveillanceNews.deleteMany({});
  await tx.surveillanceNews.createMany({
    data: file.items.map((n, i) => ({
      id: n.id,
      order: i,
      isoDate: new Date(n.iso_date),
      dateLabel: n.date_label,
      titleEs: n.title_es,
      titleEn: n.title_en,
      link: n.link,
      tags: n.tags,
      severity: n.severity,
      summaryEs: n.summary_es,
      summaryEn: n.summary_en,
    })),
  });
}
