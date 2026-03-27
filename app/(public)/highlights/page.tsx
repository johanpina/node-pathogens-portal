import { prisma } from "@/lib/db";
import PageHeader from "@/components/layout/PageHeader";
import HighlightCard from "@/components/cards/HighlightCard";
import Link from "next/link";
import { getLang } from "@/lib/getLang";
import { getT } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function HighlightsPage() {
  const [highlights, topics, lang] = await Promise.all([
    prisma.highlight.findMany({
      where: { published: true },
      orderBy: { date: "desc" },
      include: { topics: { include: { topic: true } } },
    }),
    prisma.topic.findMany({ orderBy: { menuOrder: "asc" } }),
    getLang(),
  ]);
  const t = getT(lang);

  return (
    <>
      <PageHeader title={t.highlights.title} breadcrumbs={[{ label: t.highlights.title }]} />
      <div className="container py-5">
        {topics.length > 0 && (
          <div className="mb-4 d-flex flex-wrap gap-2 align-items-center">
            <span className="fw-semibold text-muted">{t.highlights.filter}</span>
            <Link href="/highlights" className="topic_badge">{t.highlights.all}</Link>
            {topics.map((topic) => (
              <Link key={topic.id} href={`/highlights/topics/${topic.slug}`} className="topic_badge">
                {topic.name}
              </Link>
            ))}
          </div>
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
