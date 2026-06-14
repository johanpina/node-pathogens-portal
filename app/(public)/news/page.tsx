import { prisma } from "@/lib/db";
import PageHeader from "@/components/layout/PageHeader";
import Link from "next/link";
import { getLang } from "@/lib/getLang";
import { getT } from "@/lib/i18n";
import { pick } from "@/lib/pickLang";
import { mapLink } from "@/lib/surveillance/linkMap";

export const dynamic = "force-dynamic";

const SEVERITY: Record<string, string> = {
  high: "bg-danger",
  medium: "bg-warning text-dark",
  info: "bg-secondary",
};

export default async function NewsPage() {
  const [news, lang] = await Promise.all([
    prisma.surveillanceNews.findMany({ orderBy: [{ order: "asc" }, { isoDate: "desc" }] }),
    getLang(),
  ]);
  const t = getT(lang);

  return (
    <>
      <PageHeader title={t.news.title} breadcrumbs={[{ label: t.news.title }]} />
      <div className="container py-5" style={{ maxWidth: 820 }}>
        {news.length === 0 ? (
          <p className="text-muted">{t.news.empty}</p>
        ) : (
          <div className="d-flex flex-column gap-3">
            {news.map((n) => (
              <Link
                key={n.id}
                href={mapLink(n.link)}
                className="text-decoration-none clean-card card shadow-sm"
              >
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="small text-muted">{n.dateLabel}</span>
                    <span className={`badge ${SEVERITY[n.severity] ?? "bg-secondary"}`}>
                      {n.severity}
                    </span>
                  </div>
                  <h3 className="h6 text-dark mb-1">{pick(n, lang, "title")}</h3>
                  <p className="small text-muted mb-0">{pick(n, lang, "summary")}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
