import PageHeader from "@/components/layout/PageHeader";
import Datasets from "@/components/public/Datasets";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = { title: "Datasets — Portal de Patógenos" };

export default async function DatasetsPage() {
  let query = "pathogen";
  try {
    const setting = await prisma.setting.findUnique({ where: { key: "europepmc_query" } });
    if (setting?.value) query = setting.value;
  } catch {
    // use default
  }

  return (
    <>
      <PageHeader
        title="Datasets"
        breadcrumbs={[{ label: "Datasets" }]}
      />
      <div className="container py-5">
        <p className="text-muted mb-4">
          Datasets de EBI BioSamples relacionados con <strong>{query}</strong>.
        </p>
        <Datasets query={query} />
      </div>
    </>
  );
}
