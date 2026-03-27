import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import HighlightCard from "@/components/cards/HighlightCard";
import DashboardCard from "@/components/cards/DashboardCard";
import { getLang } from "@/lib/getLang";
import { getT } from "@/lib/i18n";

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
        highlights: {
          include: { highlight: true },
          where: { highlight: { published: true } },
          orderBy: { highlight: { date: "desc" } },
        },
        dashboards: {
          include: { dashboard: true },
          where: { dashboard: { published: true } },
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
        banner={topic.banner}
        bannerCaption={topic.bannerCaption}
        breadcrumbs={[
          { label: t.topicDetail.topicsNav, href: "/topics" },
          { label: topic.name },
        ]}
      />
      <div className="container py-5">
        {topic.description && (
          <p className="lead text-muted mb-5">{topic.description}</p>
        )}

        {topic.highlights.length > 0 && (
          <section className="mb-5">
            <h3 className="section-title">{t.topicDetail.highlightsLabel}</h3>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              {topic.highlights.map(({ highlight }) => (
                <HighlightCard key={highlight.id} {...highlight} tags={highlight.tags} />
              ))}
            </div>
          </section>
        )}

        {topic.dashboards.length > 0 && (
          <section className="mb-5">
            <h3 className="section-title">{t.topicDetail.dashboardsLabel}</h3>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              {topic.dashboards.map(({ dashboard }) => (
                <DashboardCard key={dashboard.id} {...dashboard} />
              ))}
            </div>
          </section>
        )}

        {topic.highlights.length === 0 && topic.dashboards.length === 0 && (
          <p className="text-muted">{t.topicDetail.empty}</p>
        )}
      </div>
    </>
  );
}
