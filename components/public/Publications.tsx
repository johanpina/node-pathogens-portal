"use client";

import { useState, useEffect } from "react";
import { getT, type Lang } from "@/lib/i18n";

interface Article {
  id: string;
  title: string;
  authorString: string;
  journalTitle: string;
  pubYear: string;
  doi?: string;
  source: string;
}

interface PublicationsProps {
  query?: string;
  lang?: Lang;
}

/** Europe PMC titles contain entity-encoded HTML (e.g. &lt;i&gt;). Decode and strip tags. */
function cleanTitle(raw: string): string {
  const decoded = raw
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
  return decoded.replace(/<[^>]+>/g, "").trim();
}

export default function Publications({ query = "pathogen", lang = "en" }: PublicationsProps) {
  const tp = getT(lang).publications;
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(query)}&format=json&pageSize=10&resultType=core&sort=P_PDATE_D+desc&page=${page}`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setArticles(data.resultList?.result ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError(tp.error);
        setLoading(false);
      });
  }, [query, page, tp.error]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2 text-muted">{tp.loading}</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-warning">{error}</div>;
  }

  return (
    <div>
      {articles.length === 0 ? (
        <p className="text-muted">{tp.empty}</p>
      ) : (
        <div className="list-group">
          {articles.map((article) => (
            <div key={article.id} className="list-group-item list-group-item-action py-3">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <h6 className="mb-1 fw-semibold">
                    {article.doi ? (
                      <a
                        href={`https://doi.org/${article.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                      >
                        {cleanTitle(article.title)}
                      </a>
                    ) : (
                      cleanTitle(article.title)
                    )}
                  </h6>
                  <p className="mb-1 small text-muted">{article.authorString}</p>
                  <p className="mb-0 small">
                    <em>{article.journalTitle}</em>
                    {article.pubYear && ` (${article.pubYear})`}
                    {article.doi && (
                      <span className="ms-2">
                        DOI:{" "}
                        <a
                          href={`https://doi.org/${article.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted"
                        >
                          {article.doi}
                        </a>
                      </span>
                    )}
                  </p>
                </div>
                <span className="badge bg-light text-dark ms-2 flex-shrink-0">
                  {article.source}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="d-flex justify-content-center gap-2 mt-4">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
        >
          <i className="bi bi-chevron-left"></i> {tp.prev}
        </button>
        <span className="btn btn-light btn-sm disabled">{tp.page} {page}</span>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setPage((p) => p + 1)}
          disabled={articles.length < 10 || loading}
        >
          {tp.next} <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  );
}
