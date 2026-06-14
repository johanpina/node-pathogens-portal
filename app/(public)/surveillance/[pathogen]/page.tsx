import { prisma } from "@/lib/db";
import PageHeader from "@/components/layout/PageHeader";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLang } from "@/lib/getLang";
import { getT } from "@/lib/i18n";
import { pick } from "@/lib/pickLang";
import PathogenCharts from "@/components/surveillance/PathogenCharts";

export const dynamic = "force-dynamic";

export default async function PathogenDetailPage({
  params,
}: {
  params: Promise<{ pathogen: string }>;
}) {
  const { pathogen: id } = await params;
  const [pathogen, lang] = await Promise.all([
    prisma.pathogen.findUnique({
      where: { id },
      include: {
        stats: { where: { kind: "headline" }, orderBy: { order: "asc" } },
        sources: { orderBy: { order: "asc" } },
        charts: { orderBy: { order: "asc" } },
      },
    }),
    getLang(),
  ]);

  if (!pathogen) notFound();
  const t = getT(lang);
  const name = pick(pathogen, lang, "name");
  const notes = pick(pathogen, lang, "notes");

  return (
    <>
      <PageHeader
        title={name}
        breadcrumbs={[
          { label: t.surveillance.title, href: "/surveillance" },
          { label: name },
        ]}
      />
      <div className="container py-5">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
          <Link href="/surveillance" className="text-decoration-none small">
            {t.surveillance.backToList}
          </Link>
          <span
            className="badge rounded-pill"
            style={{ backgroundColor: pathogen.color }}
          >
            {pick(pathogen, lang, "statusLabel")}
          </span>
        </div>

        {pathogen.stats.length > 0 && (
          <section className="mb-5">
            <h2 className="h5 mb-3">{t.surveillance.headlineTitle}</h2>
            <div className="row row-cols-2 row-cols-md-4 g-3">
              {pathogen.stats.map((s) => (
                <div className="col" key={s.id}>
                  <div className="card h-100 text-center border-0 shadow-sm">
                    <div className="card-body">
                      <div
                        className="fw-bold fs-3"
                        style={{ color: pathogen.color }}
                      >
                        {s.value}
                      </div>
                      <div className="small text-muted">
                        {pick(s, lang, "label")}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <PathogenCharts
          charts={pathogen.charts.map((c) => ({
            id: c.id,
            kind: c.kind,
            title: pick(c, lang, "title"),
            narrative: pick(c, lang, "narrative") || null,
            config: c.config as { type: string; data: unknown; options?: unknown },
          }))}
        />

        {notes && (
          <section className="mb-5">
            <h2 className="h5 mb-3">{t.surveillance.notesTitle}</h2>
            <p className="text-muted">{notes}</p>
          </section>
        )}

        {pathogen.sources.length > 0 && (
          <section className="mb-4">
            <h2 className="h5 mb-3">{t.surveillance.sourcesTitle}</h2>
            <ul className="list-group">
              {pathogen.sources.map((src) => (
                <li
                  key={src.id}
                  className="list-group-item d-flex justify-content-between align-items-start flex-wrap"
                >
                  <span>
                    {src.url ? (
                      <a href={src.url} target="_blank" rel="noopener noreferrer">
                        {src.name}
                      </a>
                    ) : (
                      src.name
                    )}
                  </span>
                  {src.retrievedAt && (
                    <small className="text-muted">
                      {t.surveillance.retrieved}: {src.retrievedAt}
                    </small>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {pathogen.epiWeek && (
          <p className="small text-muted">
            {t.surveillance.epiWeek}: {pathogen.epiWeek}
          </p>
        )}
      </div>
    </>
  );
}
