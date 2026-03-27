import { prisma } from "@/lib/db";
import PageHeader from "@/components/layout/PageHeader";
import DashboardCard from "@/components/cards/DashboardCard";
import Link from "next/link";
import { getLang } from "@/lib/getLang";
import { getT } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function DashboardsPage() {
  const [dashboards, topics, lang] = await Promise.all([
    prisma.dashboard.findMany({
      where: { published: true },
      orderBy: { title: "asc" },
      include: { topics: { include: { topic: true } } },
    }),
    prisma.topic.findMany({ orderBy: { menuOrder: "asc" } }),
    getLang(),
  ]);
  const t = getT(lang);

  return (
    <>
      <PageHeader title={t.dashboards.title} breadcrumbs={[{ label: t.dashboards.title }]} />
      <div className="container py-5">
        {topics.length > 0 && (
          <div className="mb-4 d-flex flex-wrap gap-2 align-items-center">
            <span className="fw-semibold text-muted">{t.dashboards.filter}</span>
            <Link href="/dashboards" className="topic_badge">{t.dashboards.all}</Link>
            {topics.map((topic) => (
              <Link key={topic.id} href={`/dashboards/topics/${topic.slug}`} className="topic_badge">
                {topic.name}
              </Link>
            ))}
          </div>
        )}
        {dashboards.length === 0 ? (
          <p className="text-muted">{t.dashboards.empty}</p>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {dashboards.map((item) => (
              <DashboardCard key={item.id} {...item} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
