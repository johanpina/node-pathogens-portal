/**
 * Field-level diff between two parsed bundles (maps of relPath -> json), for
 * the admin preview. Mirrors the numerical diff in Javier's apply_update.sh.
 */
export interface DiffEntry {
  file: string;
  path: string;
  before: unknown;
  after: unknown;
}

export interface BundleDiff {
  newFiles: string[];
  changes: DiffEntry[];
  changedFiles: number;
}

function walk(
  a: unknown,
  b: unknown,
  file: string,
  path: string,
  out: DiffEntry[]
) {
  if (isObj(a) && isObj(b)) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) walk(a[k], b[k], file, path ? `${path}.${k}` : k, out);
  } else if (Array.isArray(a) && Array.isArray(b)) {
    const n = Math.max(a.length, b.length);
    for (let i = 0; i < n; i++) walk(a[i], b[i], file, `${path}[${i}]`, out);
  } else if (JSON.stringify(a) !== JSON.stringify(b)) {
    out.push({ file, path, before: a ?? null, after: b ?? null });
  }
}

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function diffBundles(
  live: Record<string, unknown>,
  next: Record<string, unknown>
): BundleDiff {
  const newFiles: string[] = [];
  const changes: DiffEntry[] = [];
  const changedFiles = new Set<string>();

  for (const [file, nextJson] of Object.entries(next)) {
    const liveJson = live[file];
    if (liveJson === undefined) {
      newFiles.push(file);
      changedFiles.add(file);
      continue;
    }
    const before = changes.length;
    walk(liveJson, nextJson, file, "", changes);
    if (changes.length > before) changedFiles.add(file);
  }

  return { newFiles, changes, changedFiles: changedFiles.size };
}
