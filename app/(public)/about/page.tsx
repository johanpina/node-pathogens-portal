import PageHeader from "@/components/layout/PageHeader";
import { prisma } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = { title: "Acerca de — Portal de Patógenos" };

export default async function AboutPage() {
  let siteTitle = "Portal de Patógenos Chile";
  let siteDescription = "Red Nacional de Datos de Patógenos";
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

  return (
    <>
      <PageHeader
        title="Acerca de"
        breadcrumbs={[{ label: "Acerca de" }]}
      />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2 className="text-portal-primary">{siteTitle}</h2>
            <p className="lead">{siteDescription}</p>

            <p>
              Este portal forma parte de la red internacional de portales de
              patógenos coordinada por el{" "}
              <a href="https://www.pathogensportal.org" target="_blank" rel="noopener noreferrer">
                Pathogens Portal
              </a>
              . Nuestra misión es facilitar el acceso a datos abiertos sobre
              patógenos en Chile, promoviendo la ciencia colaborativa y
              reproducible.
            </p>

            <h4 className="mt-4">Recursos</h4>
            <div className="list-group">
              <Link href="/highlights" className="list-group-item list-group-item-action">
                <i className="bi bi-star me-2 text-warning"></i>Destacados científicos
              </Link>
              <Link href="/dashboards" className="list-group-item list-group-item-action">
                <i className="bi bi-bar-chart me-2 text-success"></i>Dashboards y visualizaciones
              </Link>
              <Link href="/publications" className="list-group-item list-group-item-action">
                <i className="bi bi-journal-text me-2 text-primary"></i>Publicaciones (Europe PMC)
              </Link>
              <Link href="/datasets" className="list-group-item list-group-item-action">
                <i className="bi bi-database me-2 text-info"></i>Datasets (EBI BioSamples)
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
