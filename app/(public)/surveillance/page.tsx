import { prisma } from "@/lib/db";
import PageHeader from "@/components/layout/PageHeader";
import PathogenCard from "@/components/cards/PathogenCard";
import DashboardCard from "@/components/cards/DashboardCard";
import { getLang } from "@/lib/getLang";
import { getT } from "@/lib/i18n";
import { pick } from "@/lib/pickLang";

export const dynamic = "force-dynamic";

export default async function SurveillancePage() {
  const [pathogens, meta, externalDashboards, lang] = await Promise.all([
    prisma.pathogen.findMany({
      orderBy: { order: "asc" },
      include: {
        stats: { where: { kind: "card" }, orderBy: { order: "asc" } },
      },
    }),
    prisma.epiMeta.findUnique({ where: { id: "current" } }),
    prisma.dashboard.findMany({
      where: { published: true, NOT: { redirectUrl: null } },
      orderBy: { title: "asc" },
    }),
    getLang(),
  ]);
  const t = getT(lang);

  return (
    <>
      <PageHeader
        title={t.surveillance.title}
        breadcrumbs={[{ label: t.surveillance.title }]}
      />
      <div className="container py-5">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
          <p className="text-muted mb-0" style={{ maxWidth: 720 }}>
            {t.surveillance.intro}
          </p>
          {meta && (
            <span className="badge bg-light text-dark border">
              {t.surveillance.epiWeek}: <strong>{meta.epiWeek}</strong>
            </span>
          )}
        </div>

        <h2 className="section-title mb-3">{t.surveillance.ourDashboards}</h2>
        {pathogens.length === 0 ? (
          <p className="text-muted">{t.surveillance.empty}</p>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
            {pathogens.map((p) => (
              <PathogenCard
                key={p.id}
                id={p.id}
                name={pick(p, lang, "name")}
                status={p.status}
                statusLabel={pick(p, lang, "statusLabel")}
                icon={p.icon}
                color={p.color}
                summary={pick(p, lang, "summary")}
                stats={p.stats.map((s) => ({ value: s.value, label: pick(s, lang, "label") }))}
                detailLabel={t.surveillance.viewDetail}
              />
            ))}
          </div>
        )}

        {externalDashboards.length > 0 && (
          <>
            <h2 className="section-title mb-3 mt-5">{t.surveillance.externalDashboards}</h2>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
              {externalDashboards.map((d) => (
                <DashboardCard key={d.id} {...d} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
