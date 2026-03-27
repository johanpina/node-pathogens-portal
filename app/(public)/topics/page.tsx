import { prisma } from "@/lib/db";
import PageHeader from "@/components/layout/PageHeader";
import Link from "next/link";
import { getLang } from "@/lib/getLang";
import { getT } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function TopicsPage() {
  const [topics, lang] = await Promise.all([
    prisma.topic.findMany({
      orderBy: { menuOrder: "asc" },
      include: { _count: { select: { highlights: true, dashboards: true } } },
    }),
    getLang(),
  ]);
  const t = getT(lang);

  return (
    <>
      <PageHeader title={t.topics.title} breadcrumbs={[{ label: t.topics.title }]} />
      <div className="container py-5">
        <div className="row g-4">
          {topics.map((topic) => (
            <div key={topic.id} className="col-md-6 col-lg-4">
              <Link href={`/topics/${topic.slug}`} className="text-decoration-none">
                <div className="card portal-card h-100">
                  {topic.banner && (
                    <div
                      style={{
                        height: "140px",
                        background: `url(${topic.banner}) center/cover`,
                        borderRadius: "0.5rem 0.5rem 0 0",
                      }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="fw-bold text-portal-primary">{topic.name}</h5>
                    {topic.description && (
                      <p className="text-muted small">{topic.description}</p>
                    )}
                    <div className="d-flex gap-3 mt-2 small text-muted">
                      <span>
                        <i className="bi bi-star me-1"></i>
                        {topic._count.highlights} {t.topics.highlights}
                      </span>
                      <span>
                        <i className="bi bi-bar-chart me-1"></i>
                        {topic._count.dashboards} {t.topics.dashboards}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
          {topics.length === 0 && (
            <div className="col">
              <p className="text-muted">{t.topics.empty}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
