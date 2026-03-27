import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HighlightArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const highlight = await prisma.highlight.findUnique({
    where: { slug, published: true },
    include: { topics: { include: { topic: true } } },
  });

  if (!highlight) notFound();

  const dateStr = new Date(highlight.date).toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <PageHeader
        title={highlight.title}
        banner={highlight.bannerLarge ?? highlight.banner}
        bannerCaption={highlight.bannerCaption}
        breadcrumbs={[
          { label: "Destacados", href: "/highlights" },
          { label: highlight.title },
        ]}
      />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <p className="text-muted mb-3">
              <i className="bi bi-calendar3 me-1"></i>{dateStr}
            </p>

            {/* Topics */}
            {highlight.topics.length > 0 && (
              <div className="mb-3">
                {highlight.topics.map(({ topic }) => (
                  <Link key={topic.id} href={`/highlights/topics/${topic.slug}`} className="topic_badge me-1">
                    {topic.name}
                  </Link>
                ))}
              </div>
            )}

            <p className="lead border-start border-4 border-success ps-3 py-2 bg-light rounded">
              {highlight.summary}
            </p>

            <article
              className="portal-article mt-4"
              dangerouslySetInnerHTML={{ __html: highlight.content }}
            />

            {/* Tags */}
            {highlight.tags.length > 0 && (
              <div className="mt-4 pt-3 border-top">
                <span className="text-muted small me-2">Tags:</span>
                {highlight.tags.map((tag) => (
                  <span key={tag} className="badge bg-light text-dark border me-1">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
