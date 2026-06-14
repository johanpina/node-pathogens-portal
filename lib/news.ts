/**
 * Real news feed from Google News RSS, localized to Chile (es-419 / CL) and
 * scoped to pathogen/outbreak terms. Used for the public "News" page and the
 * home "What's New?" sidebar. No API key required.
 */

export interface NewsArticle {
  title: string;
  link: string;
  source: string;
  isoDate: string; // ISO date
}

export const DEFAULT_NEWS_QUERY =
  '(brote OR patógeno OR hantavirus OR dengue OR influenza OR sarampión OR "virus respiratorio") Chile';

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .trim();
}

function tag(block: string, name: string): string | null {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? decodeEntities(m[1]) : null;
}

/** Fetch + parse Google News RSS. Cached 30 min; returns [] on failure. */
export async function fetchNews(
  query: string = DEFAULT_NEWS_QUERY,
  max = 12
): Promise<NewsArticle[]> {
  const url =
    "https://news.google.com/rss/search?q=" +
    encodeURIComponent(query) +
    "&hl=es-419&gl=CL&ceid=CL:es";
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; PathogenPortal/1.0)" },
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
    const out: NewsArticle[] = [];
    for (const block of items.slice(0, max)) {
      const rawTitle = tag(block, "title") ?? "";
      const link = tag(block, "link") ?? "";
      const source = tag(block, "source") ?? "";
      const pub = tag(block, "pubDate");
      if (!rawTitle || !link) continue;
      // Google titles end with " - <Source>"; drop that suffix when redundant.
      const title =
        source && rawTitle.endsWith(` - ${source}`)
          ? rawTitle.slice(0, -(source.length + 3))
          : rawTitle;
      const isoDate = pub ? new Date(pub).toISOString() : "";
      out.push({ title, link, source, isoDate });
    }
    return out;
  } catch {
    return [];
  }
}
