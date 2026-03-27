import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import DashboardCard from "@/components/cards/DashboardCard";
import { getLang } from "@/lib/getLang";
import { getT } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function DashboardsByTopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic: topicSlug } = await params;
  const [topic, lang] = await Promise.all([
    prisma.topic.findUnique({ where: { slug: topicSlug } }),
    getLang(),
  ]);
  if (!topic) notFound();
  const t = getT(lang);

  const dashboards = await prisma.dashboard.findMany({
    where: { published: true, topics: { some: { topicId: topic.id } } },
    orderBy: { title: "asc" },
  });

  return (
    <>
      <PageHeader
        title={`${t.dashboards.title}: ${topic.name}`}
        breadcrumbs={[
          { label: t.dashboards.title, href: "/dashboards" },
          { label: topic.name },
        ]}
      />
      <div className="container py-5">
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
