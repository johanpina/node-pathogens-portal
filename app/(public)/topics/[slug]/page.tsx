import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import PathogenCard from "@/components/cards/PathogenCard";
import { getLang } from "@/lib/getLang";
import { getT } from "@/lib/i18n";
import { pick } from "@/lib/pickLang";

export const dynamic = "force-dynamic";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [topic, lang] = await Promise.all([
    prisma.topic.findUnique({
      where: { slug },
      include: {
        pathogens: {
          orderBy: { order: "asc" },
          include: { stats: { where: { kind: "card" }, orderBy: { order: "asc" } } },
        },
      },
    }),
    getLang(),
  ]);

  if (!topic) notFound();
  const t = getT(lang);

  return (
    <>
      <PageHeader
        title={topic.name}
        breadcrumbs={[
          { label: t.topicDetail.topicsNav, href: "/topics" },
          { label: topic.name },
        ]}
      />
      <div className="container py-5">
        {topic.description && (
          <p className="lead text-muted mb-4" style={{ maxWidth: 760 }}>
            {topic.description}
          </p>
        )}

        <div className="d-flex flex-wrap gap-2 mb-5">
          <Link href="/surveillance" className="btn btn-outline-primary btn-sm">
            <i className="bi bi-graph-up me-1"></i> {t.topicDetail.exploreDashboards}
          </Link>
          <Link href="/datasets" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-database me-1"></i> {t.topicDetail.exploreData}
          </Link>
        </div>

        {topic.pathogens.length > 0 ? (
          <section>
            <h2 className="section-title mb-3">{t.topicDetail.pathogensTitle}</h2>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
              {topic.pathogens.map((p) => (
                <PathogenCard
                  key={p.id}
                  id={p.id}
                  name={pick(p, lang, "name")}
                  status={p.status}
                  statusLabel={pick(p, lang, "statusLabel")}
                  icon={p.icon}
                  color={p.color}
                  summary={pick(p, lang, "summary")}
                  stats={p.stats.map((s) => ({ value: s.value, label: pick(s, lang, "label") }))}
                  detailLabel={t.surveillance.viewDetail}
                />
              ))}
            </div>
          </section>
        ) : (
          <p className="text-muted">{t.topicDetail.empty}</p>
        )}
      </div>
    </>
  );
}
