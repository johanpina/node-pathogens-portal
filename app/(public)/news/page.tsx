import { prisma } from "@/lib/db";
import PageHeader from "@/components/layout/PageHeader";
import NewsCard from "@/components/cards/NewsCard";
import { getLang } from "@/lib/getLang";
import { getT } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const [news, lang] = await Promise.all([
    prisma.news.findMany({ where: { published: true }, orderBy: { date: "desc" } }),
    getLang(),
  ]);
  const t = getT(lang);

  return (
    <>
      <PageHeader title={t.news.title} breadcrumbs={[{ label: t.news.title }]} />
      <div className="container py-5">
        {news.length === 0 ? (
          <p className="text-muted">{t.news.empty}</p>
        ) : (
          <div className="row">
            {news.map((item) => (
              <NewsCard key={item.id} {...item} lang={lang} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
