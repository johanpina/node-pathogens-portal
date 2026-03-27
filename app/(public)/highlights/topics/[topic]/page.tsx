import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import HighlightCard from "@/components/cards/HighlightCard";
import { getLang } from "@/lib/getLang";
import { getT } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function HighlightsByTopicPage({
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

  const highlights = await prisma.highlight.findMany({
    where: { published: true, topics: { some: { topicId: topic.id } } },
    orderBy: { date: "desc" },
    include: { topics: { include: { topic: true } } },
  });

  return (
    <>
      <PageHeader
        title={`${t.highlights.title}: ${topic.name}`}
        banner={topic.banner}
        bannerCaption={topic.bannerCaption}
        breadcrumbs={[
          { label: t.highlights.title, href: "/highlights" },
          { label: topic.name },
        ]}
      />
      <div className="container py-5">
        {topic.description && (
          <p className="lead text-muted mb-4">{topic.description}</p>
        )}
        {highlights.length === 0 ? (
          <p className="text-muted">{t.highlights.empty}</p>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {highlights.map((item) => (
              <HighlightCard key={item.id} {...item} tags={item.tags} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
