import { prisma } from "@/lib/db";
import PageHeader from "@/components/layout/PageHeader";
import Link from "next/link";
import { getLang } from "@/lib/getLang";
import { getT } from "@/lib/i18n";
import { topicVisual } from "@/lib/topicVisual";

export const dynamic = "force-dynamic";

export default async function TopicsPage() {
  const [topics, lang] = await Promise.all([
    prisma.topic.findMany({
      orderBy: { menuOrder: "asc" },
      include: { _count: { select: { pathogens: true } } },
    }),
    getLang(),
  ]);
  const t = getT(lang);

  return (
    <>
      <PageHeader title={t.topics.title} breadcrumbs={[{ label: t.topics.title }]} />
      <div className="container py-5">
        <p className="section-intro">{t.topics.intro}</p>

        {topics.length === 0 ? (
          <p className="text-muted">{t.topics.empty}</p>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
            {topics.map((topic) => {
              const v = topicVisual(topic.slug);
              return (
                <div className="col" key={topic.id}>
                  <Link href={`/topics/${topic.slug}`} className="text-decoration-none d-block h-100">
                    <div className="card clean-card h-100">
                      <div className="topic-card-head" style={{ background: v.color }}>
                        <i className={`bi ${v.icon}`}></i>
                      </div>
                      <div className="card-body d-flex flex-column">
                        <h3 className="h5 text-dark">{topic.name}</h3>
                        {topic.description && (
                          <p className="small text-muted flex-grow-1">{topic.description}</p>
                        )}
                        <span className="small text-muted">
                          <i className="bi bi-clipboard-pulse me-1"></i>
                          {topic._count.pathogens} {t.topics.pathogens}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
