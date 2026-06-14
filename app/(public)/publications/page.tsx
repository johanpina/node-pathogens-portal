import PageHeader from "@/components/layout/PageHeader";
import Publications from "@/components/public/Publications";
import { prisma } from "@/lib/db";
import { buildPublicationQuery } from "@/lib/europepmc";
import { getLang } from "@/lib/getLang";

export const dynamic = "force-dynamic";

export const metadata = { title: "Publicaciones — Portal de Patógenos" };

export default async function PublicationsPage() {
  let country = "Chile";
  let topic = "pathogen";
  try {
    const settings = await prisma.setting.findMany({
      where: { key: { in: ["country", "publications_topic"] } },
    });
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    if (map.country) country = map.country;
    if (map.publications_topic) topic = map.publications_topic;
  } catch {
    // use defaults
  }
  const lang = await getLang();
  const query = buildPublicationQuery(topic, country);

  return (
    <>
      <PageHeader title={lang === "es" ? "Publicaciones" : "Publications"} breadcrumbs={[{ label: lang === "es" ? "Publicaciones" : "Publications" }]} />
      <div className="container py-5">
        <p className="text-muted mb-4">
          {lang === "es" ? (
            <>
              Publicaciones de Europe PMC que combinan <strong>“{topic}”</strong> y{" "}
              <strong>“{country}”</strong>.
            </>
          ) : (
            <>
              Europe PMC publications combining <strong>“{topic}”</strong> and{" "}
              <strong>“{country}”</strong>.
            </>
          )}
        </p>
        <Publications query={query} />
      </div>
    </>
  );
}
