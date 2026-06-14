/**
 * Extract the curated JSON files from an AI agent's markdown reply.
 *
 * Mirrors the extraction logic in Javier's `apply_update.sh`: it accepts
 * either a headline form
 *
 *     ### FILE: data/curated/banner_stats.json
 *     ```json
 *     { ... }
 *     ```
 *
 * or the fenced form  ```json filename=data/curated/banner_stats.json
 *
 * Returns a map of normalized relative path -> parsed JSON, plus any blocks
 * that failed to parse as JSON.
 */
export interface ParseResult {
  files: Record<string, unknown>;
  jsonErrors: { file: string; error: string }[];
}

function normalize(rel: string): string {
  let r = rel.trim().replace(/^\/+/, "");
  if (!r.startsWith("data/")) {
    // Keep the pathogens/<id>.json subpath if present, else flatten the name.
    const m = r.match(/pathogens\/[a-z0-9]+\.json$/);
    r = "data/curated/" + (m ? m[0] : r.split("/").pop());
  }
  return r;
}

const HEADLINE_RE =
  /^#{2,3}\s*FILE:\s*(\S+\.json)\s*$\r?\n\s*```(?:json)?\s*\r?\n([\s\S]*?)\r?\n```/gim;

const FENCED_RE = /```json\s+filename=(\S+\.json)\r?\n([\s\S]*?)```/gi;

export function parseBundle(markdown: string): ParseResult {
  const files: Record<string, unknown> = {};
  const jsonErrors: { file: string; error: string }[] = [];
  const seen = new Set<string>();

  for (const re of [HEADLINE_RE, FENCED_RE]) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(markdown)) !== null) {
      const rel = normalize(m[1]);
      if (seen.has(rel)) continue;
      seen.add(rel);
      const body = m[2].trim();
      try {
        files[rel] = JSON.parse(body);
      } catch (e) {
        jsonErrors.push({
          file: rel,
          error: e instanceof Error ? e.message : "JSON inválido",
        });
      }
    }
  }

  return { files, jsonErrors };
}
