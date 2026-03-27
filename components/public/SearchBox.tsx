"use client";

import { useState, useEffect } from "react";
import Fuse from "fuse.js";
import Link from "next/link";

interface SearchItem {
  title?: string;
  name?: string;
  slug: string;
  summary?: string;
  description?: string;
  type: string;
  tags?: string[];
  date?: string;
}

function getLink(item: SearchItem): string {
  if (item.type === "news") return `/news/${item.slug}`;
  if (item.type === "highlight") return `/highlights/${item.slug}`;
  if (item.type === "dashboard") return `/dashboards/${item.slug}`;
  if (item.type === "topic") return `/topics/${item.slug}`;
  return "/";
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    news: "Noticia",
    highlight: "Destacado",
    dashboard: "Dashboard",
    topic: "Tópico",
  };
  return labels[type] ?? type;
}

function getTypeBadgeColor(type: string): string {
  const colors: Record<string, string> = {
    news: "primary",
    highlight: "warning",
    dashboard: "success",
    topic: "info",
  };
  return colors[type] ?? "secondary";
}

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [allItems, setAllItems] = useState<SearchItem[]>([]);
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/search")
      .then((r) => r.json())
      .then((data) => {
        const items = [
          ...(data.news ?? []),
          ...(data.highlights ?? []),
          ...(data.dashboards ?? []),
          ...(data.topics ?? []),
        ];
        setAllItems(items);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!query.trim() || allItems.length === 0) {
      setResults([]);
      return;
    }

    const fuse = new Fuse(allItems, {
      keys: ["title", "name", "summary", "description", "tags"],
      threshold: 0.4,
      includeScore: true,
    });

    const matches = fuse.search(query);
    setResults(matches.map((m) => m.item));
  }, [query, allItems]);

  return (
    <div>
      <div className="input-group mb-4">
        <span className="input-group-text bg-white">
          <i className="bi bi-search text-muted"></i>
        </span>
        <input
          type="text"
          className="form-control form-control-lg border-start-0"
          placeholder="Buscar noticias, destacados, dashboards..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        {query && (
          <button
            className="btn btn-outline-secondary"
            onClick={() => setQuery("")}
          >
            <i className="bi bi-x"></i>
          </button>
        )}
      </div>

      {loading && (
        <div className="text-center py-3">
          <div className="spinner-border spinner-border-sm text-primary me-2"></div>
          Cargando índice de búsqueda...
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-search fs-1 d-block mb-2"></i>
          No se encontraron resultados para <strong>&quot;{query}&quot;</strong>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <p className="text-muted small mb-3">
            {results.length} resultado{results.length !== 1 ? "s" : ""} para{" "}
            <strong>&quot;{query}&quot;</strong>
          </p>
          <div className="list-group">
            {results.map((item, i) => (
              <Link
                key={i}
                href={getLink(item)}
                className="list-group-item list-group-item-action py-3"
              >
                <div className="d-flex align-items-start gap-2">
                  <span className={`badge bg-${getTypeBadgeColor(item.type)} flex-shrink-0 mt-1`}>
                    {getTypeLabel(item.type)}
                  </span>
                  <div>
                    <h6 className="mb-1 fw-semibold">
                      {item.title ?? item.name}
                    </h6>
                    {(item.summary ?? item.description) && (
                      <p className="mb-0 small text-muted line-clamp-2">
                        {item.summary ?? item.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
