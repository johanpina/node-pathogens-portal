import PageHeader from "@/components/layout/PageHeader";
import { prisma } from "@/lib/db";
import { getLang } from "@/lib/getLang";
import { getT } from "@/lib/i18n";
import { DATA_SECTIONS, dataUrl } from "@/lib/availableData";

export const dynamic = "force-dynamic";

export const metadata = { title: "Datasets — Portal de Patógenos" };

export default async function DatasetsPage() {
  let country = "Chile";
  try {
    const setting = await prisma.setting.findUnique({ where: { key: "country" } });
    if (setting?.value) country = setting.value;
  } catch {
    // use default
  }
  const lang = await getLang();
  const t = getT(lang);

  return (
    <>
      <PageHeader title={t.datasets.title} breadcrumbs={[{ label: t.datasets.title }]} />
      <div className="container py-5">
        <h2 className="section-title mb-2">{t.datasets.regionTitle}</h2>
        <p className="fw-semibold text-muted mb-2">
          {t.datasets.resultsFor} {country}
        </p>
        <p className="section-intro">
          <a href="https://www.pathogensportal.org/" target="_blank" rel="noopener noreferrer">
            Central Pathogens Portal
          </a>{" "}
          {t.datasets.intro.split("EMBL-EBI")[0]}
          <a href="https://www.ebi.ac.uk/" target="_blank" rel="noopener noreferrer">
            EMBL-EBI
          </a>
          {t.datasets.intro.split("EMBL-EBI")[1]}
        </p>

        {DATA_SECTIONS.map((section) => (
          <section key={section.titleEn} className="mb-4">
            <h3 className="h5 border-bottom pb-2 mb-3">
              {lang === "es" ? section.titleEs : section.titleEn}
            </h3>
            <div className="d-flex flex-wrap gap-2">
              {section.links.map((link) => (
                <a
                  key={link.db + link.path}
                  href={dataUrl(link.path, link.db, country)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="data-link-btn"
                >
                  {t.datasets.viewIn} {lang === "es" ? link.labelEs : link.labelEn}
                  <i className="bi bi-box-arrow-up-right ms-2"></i>
                </a>
              ))}
            </div>
          </section>
        ))}

        <p className="small text-muted mt-4">
          {lang === "es"
            ? "Los enlaces abren resultados en el Central Pathogens Portal (EMBL-EBI), filtrados por país."
            : "Links open results in the Central Pathogens Portal (EMBL-EBI), filtered by country."}
        </p>
      </div>
    </>
  );
}
