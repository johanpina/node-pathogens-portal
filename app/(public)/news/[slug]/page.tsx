import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";

export const dynamic = "force-dynamic";

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await prisma.news.findUnique({
    where: { slug, published: true },
  });

  if (!article) notFound();

  const dateStr = new Date(article.date).toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <PageHeader
        title={article.title}
        banner={article.bannerLarge ?? article.banner}
        bannerCaption={article.bannerCaption}
        breadcrumbs={[
          { label: "Noticias", href: "/news" },
          { label: article.title },
        ]}
      />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <p className="text-muted mb-4">
              <i className="bi bi-calendar3 me-1"></i>
              {dateStr}
            </p>
            <p className="lead border-start border-4 border-primary ps-3 py-2 bg-light rounded">
              {article.summary}
            </p>
            <article
              className="portal-article mt-4"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
