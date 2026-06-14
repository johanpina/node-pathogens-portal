import { PATHOGEN_IDS } from "./schemas";

/** Validate the admin chart create/update payload. Returns an error string or null. */
export function validateChartInput(body: Record<string, unknown>): string | null {
  if (!PATHOGEN_IDS.includes(body.pathogenId as never)) return "pathogenId inválido";
  if (!["line", "bar", "doughnut", "pie"].includes(body.kind as string)) return "kind inválido";
  if (!body.titleEs || !body.titleEn) return "Falta título (es/en)";
  const cfg = body.config as { data?: unknown } | undefined;
  if (!cfg || typeof cfg !== "object" || !cfg.data) return "config debe incluir 'data'";
  return null;
}
