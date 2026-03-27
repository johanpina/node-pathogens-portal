import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dashboard = await prisma.dashboard.findUnique({
    where: { slug, published: true },
    include: { topics: { include: { topic: true } } },
  });

  if (!dashboard) notFound();

  // If redirect URL, redirect immediately
  if (dashboard.redirectUrl) {
    redirect(dashboard.redirectUrl);
  }

  return (
    <>
      <PageHeader
        title={dashboard.title}
        banner={dashboard.banner}
        breadcrumbs={[
          { label: "Dashboards", href: "/dashboards" },
          { label: dashboard.title },
        ]}
      />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {dashboard.description && (
              <p className="lead text-muted mb-4">{dashboard.description}</p>
            )}
            {dashboard.topics.length > 0 && (
              <div className="mb-4">
                {dashboard.topics.map(({ topic }) => (
                  <Link key={topic.id} href={`/topics/${topic.slug}`} className="topic_badge me-1">
                    {topic.name}
                  </Link>
                ))}
              </div>
            )}
            {dashboard.content && (
              <div
                className="portal-article"
                dangerouslySetInnerHTML={{ __html: dashboard.content }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
