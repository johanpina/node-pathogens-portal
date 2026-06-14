import PageHeader from "@/components/layout/PageHeader";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { getLang } from "@/lib/getLang";
import { getT } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export const metadata = { title: "Acerca de — Portal de Patógenos" };

export default async function AboutPage() {
  let siteTitle = "Portal de Patógenos Chile";
  let siteDescription = "";
  try {
    const settings = await prisma.setting.findMany({
      where: { key: { in: ["site_title", "site_description"] } },
    });
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    if (map.site_title) siteTitle = map.site_title;
    if (map.site_description) siteDescription = map.site_description;
  } catch {
    // use defaults
  }
  const lang = await getLang();
  const t = getT(lang);

  return (
    <>
      <PageHeader title={t.about.title} breadcrumbs={[{ label: t.about.title }]} />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2 className="text-portal-primary">{siteTitle}</h2>
            {siteDescription && <p className="lead">{siteDescription}</p>}

            <p>
              {t.about.introBefore}
              <a href="https://www.pathogensportal.org" target="_blank" rel="noopener noreferrer">
                Pathogens Portal
              </a>
              {t.about.introAfter}
            </p>

            <h4 className="mt-4">{t.about.resourcesTitle}</h4>
            <div className="list-group">
              <Link href="/highlights" className="list-group-item list-group-item-action">
                <i className="bi bi-star me-2 text-warning"></i>
                {t.about.resHighlights}
              </Link>
              <Link href="/surveillance" className="list-group-item list-group-item-action">
                <i className="bi bi-bar-chart me-2 text-success"></i>
                {t.about.resDashboards}
              </Link>
              <Link href="/publications" className="list-group-item list-group-item-action">
                <i className="bi bi-journal-text me-2 text-primary"></i>
                {t.about.resPublications}
              </Link>
              <Link href="/datasets" className="list-group-item list-group-item-action">
                <i className="bi bi-database me-2 text-info"></i>
                {t.about.resDatasets}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
