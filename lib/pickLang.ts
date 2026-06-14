import type { Lang } from "./i18n";

/**
 * Pick the language-specific field from an object that carries parallel
 * `<base>Es` / `<base>En` columns. e.g. pick(pathogen, lang, "name").
 */
export function pick<T extends Record<string, unknown>>(
  obj: T,
  lang: Lang,
  base: string
): string {
  const key = base + (lang === "es" ? "Es" : "En");
  const val = obj[key];
  return typeof val === "string" ? val : "";
}
