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

/**
 * Pick between a default (Spanish) field and its English variant, falling back
 * to the default when the English value is missing. For models like Topic that
 * store the base language in `name` and the translation in `nameEn`.
 */
export function pickField(es: string | null, en: string | null, lang: Lang): string {
  if (lang === "en") return en || es || "";
  return es || en || "";
}
