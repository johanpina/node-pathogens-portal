import { z } from "zod";

/**
 * Zod port of Javier's Pydantic contract (templates/pydantic_schemas.json).
 * Every object is strict (mirrors Pydantic `extra=forbid`). Rule from the
 * weekly prompt: a stat `value` is never null — use the em-dash "—".
 *
 * The closed list of monitored pathogens. New diseases go into news, not here.
 */
export const PATHOGEN_IDS = [
  "influenza",
  "rsv",
  "covid19",
  "hantavirus",
  "dengue",
  "mpox",
  "salmonella",
  "amr",
] as const;

export type PathogenId = (typeof PATHOGEN_IDS)[number];

export const pathogenStatusSchema = z.enum([
  "endemic",
  "alert",
  "monitoring",
  "contained",
]);

// Card stat: exactly value/label_es/label_en, value 1–20 chars.
export const statTripletSchema = z.strictObject({
  value: z.string().min(1).max(20),
  label_es: z.string(),
  label_en: z.string(),
});

// Detail headline stat: value is looser, optional id for cross-week mapping.
export const headlineStatSchema = z.strictObject({
  id: z.string().optional(),
  value: z.string().min(1).max(40),
  label_es: z.string(),
  label_en: z.string(),
});

export const bannerStatSchema = z.strictObject({
  id: z.string(),
  value: z.string(),
  label_es: z.string(),
  label_en: z.string(),
});

export const bannerFileSchema = z.strictObject({
  schema_version: z.number().int(),
  updated_at: z.string(),
  stats: z.array(bannerStatSchema),
});

// meta.json — flat form (the one the live pipeline produces).
export const metaFileSchema = z.strictObject({
  schema_version: z.number().int(),
  epi_week: z.string(),
  ew: z.union([z.string(), z.number()]).transform(String),
  year: z.number().int(),
  updated_at: z.string(),
  home_alert: z.strictObject({
    text_es: z.string(),
    text_en: z.string(),
  }),
  regional_context: z
    .strictObject({
      last_check: z.string().optional(),
      source: z.string().optional(),
    })
    .optional(),
});

export const pathogenCardSchema = z.strictObject({
  id: z.enum(PATHOGEN_IDS),
  name_es: z.string(),
  name_en: z.string(),
  icon: z.string(),
  color: z.string(),
  status: pathogenStatusSchema,
  status_label_es: z.string(),
  status_label_en: z.string(),
  page: z.string(),
  stats: z.array(statTripletSchema).min(1),
  summary_es: z.string(),
  summary_en: z.string(),
  sources: z.array(z.string()),
});

export const pathogensFileSchema = z.strictObject({
  schema_version: z.number().int(),
  updated_at: z.string(),
  epi_week: z.string(),
  items: z.array(pathogenCardSchema),
});

export const highlightItemSchema = z.strictObject({
  id: z.string(),
  title_es: z.string(),
  title_en: z.string(),
  metric_value: z.string(),
  metric_label_es: z.string(),
  metric_label_en: z.string(),
  link: z.string(),
});

export const highlightsFileSchema = z.strictObject({
  schema_version: z.number().int(),
  updated_at: z.string(),
  items: z.array(highlightItemSchema),
});

export const newsSeveritySchema = z.enum(["high", "medium", "info"]);

export const newsItemSchema = z.strictObject({
  id: z.string(),
  iso_date: z.string(),
  date_label: z.string(),
  title_es: z.string(),
  title_en: z.string(),
  link: z.string(),
  tags: z.array(z.string()),
  severity: newsSeveritySchema,
  summary_es: z.string(),
  summary_en: z.string(),
});

export const newsFileSchema = z.strictObject({
  schema_version: z.number().int(),
  updated_at: z.string(),
  items: z.array(newsItemSchema),
});

export const sourceSchema = z.strictObject({
  id: z.string(),
  name: z.string(),
  url: z.string().optional(),
  retrieved_at: z.string().optional(),
});

export const pathogenDetailSchema = z.strictObject({
  schema_version: z.number().int(),
  pathogen: z.enum(PATHOGEN_IDS),
  updated_at: z.string(),
  status: pathogenStatusSchema,
  headline_stats: z.array(headlineStatSchema),
  notes_es: z.string(),
  notes_en: z.string(),
  sources: z.array(sourceSchema),
});

export type MetaFile = z.infer<typeof metaFileSchema>;
export type BannerFile = z.infer<typeof bannerFileSchema>;
export type PathogensFile = z.infer<typeof pathogensFileSchema>;
export type HighlightsFile = z.infer<typeof highlightsFileSchema>;
export type NewsFile = z.infer<typeof newsFileSchema>;
export type PathogenDetail = z.infer<typeof pathogenDetailSchema>;
export type PathogenCard = z.infer<typeof pathogenCardSchema>;

/**
 * Resolve the right schema for a given curated filename (relative path like
 * "data/curated/meta.json" or "data/curated/pathogens/dengue.json").
 */
export function schemaForFile(relPath: string): z.ZodTypeAny | null {
  const name = relPath.replace(/^.*data\/curated\//, "");
  if (name === "meta.json") return metaFileSchema;
  if (name === "banner_stats.json") return bannerFileSchema;
  if (name === "pathogens.json") return pathogensFileSchema;
  if (name === "highlights.json") return highlightsFileSchema;
  if (name === "news.json") return newsFileSchema;
  if (/^pathogens\/[a-z0-9]+\.json$/.test(name)) return pathogenDetailSchema;
  return null;
}

export interface FileValidationError {
  file: string;
  errors: string[];
}

/**
 * Validate a parsed bundle (map of relPath -> json). Returns one entry per
 * file that failed, with human-readable error strings. Empty array == OK.
 * Detail files whose `pathogen` doesn't match the filename are flagged.
 */
export function validateBundle(
  files: Record<string, unknown>
): FileValidationError[] {
  const out: FileValidationError[] = [];
  for (const [relPath, json] of Object.entries(files)) {
    const schema = schemaForFile(relPath);
    if (!schema) {
      out.push({ file: relPath, errors: ["archivo no reconocido en el contrato"] });
      continue;
    }
    const result = schema.safeParse(json);
    if (!result.success) {
      out.push({
        file: relPath,
        errors: result.error.issues.map((i) => {
          const where = i.path.join(".") || "(raíz)";
          if (i.code === "unrecognized_keys") {
            return `${where}: campos no permitidos: ${(i as { keys?: string[] }).keys?.join(", ")}`;
          }
          return `${where}: ${i.message}`;
        }),
      });
      continue;
    }
    // Cross-check: detail file's `pathogen` must match the filename id.
    const m = relPath.match(/pathogens\/([a-z0-9]+)\.json$/);
    if (m) {
      const data = result.data as PathogenDetail;
      if (data.pathogen !== m[1]) {
        out.push({
          file: relPath,
          errors: [`pathogen "${data.pathogen}" no coincide con el archivo "${m[1]}"`],
        });
      }
    }
  }
  return out;
}
