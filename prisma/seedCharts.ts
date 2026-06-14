import { readFileSync } from "node:fs";
import { join } from "node:path";
import { prisma } from "@/lib/db";

/**
 * Seeds the historical Chart.js dashboards (Milestone 1.5) by extracting the
 * 18 `new Chart(...)` definitions from Javier's dashboards.html. The config
 * objects are JS (not JSON), so they are evaluated with `SE` and `base`
 * defined exactly as in the source page.
 */

// The week-label array and options helper used by the source charts.
const SE = ["SE1","SE3","SE5","SE7","SE9","SE11","SE13","SE15","SE17","SE19","SE21","SE23","SE25","SE27","SE29","SE31","SE33","SE35","SE37","SE39","SE41","SE43","SE45"];
function base(e: object) {
  return Object.assign({ responsive: true, maintainAspectRatio: false }, e || {});
}

// canvasId -> pathogen + bilingual title (document order preserved below).
const CHART_META: { id: string; pathogenId: string; titleEs: string; titleEn: string }[] = [
  { id: "fluLine", pathogenId: "influenza", titleEs: "Positividad respiratoria semanal", titleEn: "Weekly respiratory positivity" },
  { id: "fluPie", pathogenId: "influenza", titleEs: "Distribución de subtipos de Influenza A", titleEn: "Influenza A subtype distribution" },
  { id: "fluBar", pathogenId: "influenza", titleEs: "Agentes respiratorios detectados", titleEn: "Detected respiratory agents" },
  { id: "hantaBar", pathogenId: "hantavirus", titleEs: "Casos y fallecidos por año", titleEn: "Cases and deaths by year" },
  { id: "hantaPie", pathogenId: "hantavirus", titleEs: "Distribución regional de casos", titleEn: "Regional case distribution" },
  { id: "hantaLetal", pathogenId: "hantavirus", titleEs: "Letalidad anual", titleEn: "Annual case fatality" },
  { id: "mpoxBar", pathogenId: "mpox", titleEs: "Casos confirmados y probables por año", titleEn: "Confirmed and probable cases by year" },
  { id: "mpoxPie", pathogenId: "mpox", titleEs: "Distribución regional", titleEn: "Regional distribution" },
  { id: "mpoxMonth", pathogenId: "mpox", titleEs: "Casos mensuales (brote 2022–2023)", titleEn: "Monthly cases (2022–2023 outbreak)" },
  { id: "dengueBar", pathogenId: "dengue", titleEs: "Casos importados y autóctonos", titleEn: "Imported and autochthonous cases" },
  { id: "arbovirusPie", pathogenId: "dengue", titleEs: "Distribución de arbovirus", titleEn: "Arbovirus distribution" },
  { id: "dengueOrigen", pathogenId: "dengue", titleEs: "Origen de casos importados", titleEn: "Origin of imported cases" },
  { id: "covidLine", pathogenId: "covid19", titleEs: "Positividad semanal de SARS-CoV-2", titleEn: "Weekly SARS-CoV-2 positivity" },
  { id: "covidPie", pathogenId: "covid19", titleEs: "Agentes respiratorios", titleEn: "Respiratory agents" },
  { id: "covidTrimestre", pathogenId: "covid19", titleEs: "Positividad respiratoria por trimestre", titleEn: "Respiratory positivity by quarter" },
  { id: "rsvSeasonal", pathogenId: "rsv", titleEs: "Estacionalidad del VRS", titleEn: "RSV seasonality" },
  { id: "rsvImpact", pathogenId: "rsv", titleEs: "Impacto de la inmunización", titleEn: "Immunization impact" },
  { id: "rsvAge", pathogenId: "rsv", titleEs: "Hospitalizaciones por grupo etario", titleEn: "Hospitalizations by age group" },
];

// Narratives appear in this document order in dashboards.html.
const NARRATIVE_ORDER = ["influenza", "hantavirus", "mpox", "dengue", "covid19", "rsv"];

export async function seedCharts() {
  const html = readFileSync(join(process.cwd(), "prisma", "data", "dashboards.html"), "utf-8");

  // Extract each chart's config object (JS literal) and evaluate it.
  const configs: Record<string, { type: string; data: unknown; options: unknown }> = {};
  const re = /new Chart\(document\.getElementById\('([^']+)'\),(\{.*\})\)\s*;/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const id = m[1];
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const fn = new Function("SE", "base", `return (${m[2]});`);
    configs[id] = fn(SE, base);
  }

  // Extract the 6 long bilingual narratives, in document order.
  const narrativeRe = /data-es="([^"]{180,})"\s+data-en="([^"]{120,})"/g;
  const narratives: Record<string, { es: string; en: string }> = {};
  let i = 0;
  let nm: RegExpExecArray | null;
  while ((nm = narrativeRe.exec(html)) !== null && i < NARRATIVE_ORDER.length) {
    narratives[NARRATIVE_ORDER[i]] = { es: nm[1], en: nm[2] };
    i++;
  }

  await prisma.pathogenChart.deleteMany({});

  const orderByPathogen: Record<string, number> = {};
  let created = 0;
  for (const meta of CHART_META) {
    const cfg = configs[meta.id];
    if (!cfg) {
      console.warn(`chart config not found: ${meta.id}`);
      continue;
    }
    const order = orderByPathogen[meta.pathogenId] ?? 0;
    orderByPathogen[meta.pathogenId] = order + 1;
    const narrative = order === 0 ? narratives[meta.pathogenId] : undefined;
    await prisma.pathogenChart.create({
      data: {
        pathogenId: meta.pathogenId,
        order,
        kind: cfg.type,
        titleEs: meta.titleEs,
        titleEn: meta.titleEn,
        config: { type: cfg.type, data: cfg.data, options: cfg.options } as object,
        narrativeEs: narrative?.es ?? null,
        narrativeEn: narrative?.en ?? null,
      },
    });
    created++;
  }
  console.log(`Seeded ${created} pathogen charts`);
}

if (process.argv[1] && process.argv[1].includes("seedCharts")) {
  seedCharts()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
