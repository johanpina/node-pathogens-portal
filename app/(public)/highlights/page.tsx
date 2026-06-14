import { prisma } from "@/lib/db";
import PageHeader from "@/components/layout/PageHeader";
import Link from "next/link";
import { getLang } from "@/lib/getLang";
import { getT } from "@/lib/i18n";
import { pick } from "@/lib/pickLang";
import { mapLink } from "@/lib/surveillance/linkMap";

export const dynamic = "force-dynamic";

export default async function HighlightsPage() {
  const [highlights, lang] = await Promise.all([
    prisma.surveillanceHighlight.findMany({ orderBy: { order: "asc" } }),
    getLang(),
  ]);
  const t = getT(lang);

  return (
    <>
      <PageHeader title={t.highlights.title} breadcrumbs={[{ label: t.highlights.title }]} />
      <div className="container py-5">
        {highlights.length === 0 ? (
          <p className="text-muted">{t.highlights.empty}</p>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
            {highlights.map((h) => (
              <div className="col" key={h.id}>
                <Link href={mapLink(h.link)} className="text-decoration-none d-block h-100">
                  <div className="card h-100 shadow-sm clean-card">
                    <div className="card-body d-flex flex-column">
                      <div className="display-6 fw-bold text-primary">{h.metricValue}</div>
                      <div className="small text-muted mb-2">{pick(h, lang, "metricLabel")}</div>
                      <p className="text-dark mb-0">{pick(h, lang, "title")}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
