import PageHeader from "@/components/layout/PageHeader";
import Publications from "@/components/public/Publications";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = { title: "Publicaciones — Portal de Patógenos" };

export default async function PublicationsPage() {
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
        title="Publicaciones"
        breadcrumbs={[{ label: "Publicaciones" }]}
      />
      <div className="container py-5">
        <p className="text-muted mb-4">
          Publicaciones de Europa PMC relacionadas con{" "}
          <strong>{query}</strong>.
        </p>
        <Publications query={query} />
      </div>
    </>
  );
}
