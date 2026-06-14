export interface PMCArticle {
  id: string;
  title: string;
  authorString: string;
  journalTitle: string;
  pubYear: string;
  doi?: string;
  pmid?: string;
  source: string;
}

/**
 * Build a Europe PMC query that requires BOTH the topic phrase and the country
 * as quoted phrases, e.g. `"pathogen" AND "Chile"`.
 */
export function buildPublicationQuery(topic = "pathogen", country = "Chile"): string {
  return `"${topic}" AND "${country}"`;
}

export async function fetchPublications(
  query: string,
  pageSize = 10
): Promise<PMCArticle[]> {
  const url = new URL("https://www.ebi.ac.uk/europepmc/webservices/rest/search");
  url.searchParams.set("query", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("pageSize", String(pageSize));
  url.searchParams.set("resultType", "core");
  url.searchParams.set("sort", "P_PDATE_D desc");

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  const data = await res.json();
  return (data.resultList?.result ?? []) as PMCArticle[];
}
