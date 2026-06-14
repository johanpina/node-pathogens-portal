import PageHeader from "@/components/layout/PageHeader";
import { prisma } from "@/lib/db";
import { getLang } from "@/lib/getLang";
import { getT } from "@/lib/i18n";
import { fetchNews, DEFAULT_NEWS_QUERY } from "@/lib/news";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  let query = DEFAULT_NEWS_QUERY;
  try {
    const setting = await prisma.setting.findUnique({ where: { key: "news_query" } });
    if (setting?.value) query = setting.value;
  } catch {
    // use default
  }
  const [articles, lang] = await Promise.all([fetchNews(query, 24), getLang()]);
  const t = getT(lang);
  const locale = lang === "es" ? "es-CL" : "en-GB";

  return (
    <>
      <PageHeader title={t.news.title} breadcrumbs={[{ label: t.news.title }]} />
      <div className="container py-5" style={{ maxWidth: 860 }}>
        <p className="section-intro">{t.news.intro}</p>

        {articles.length === 0 ? (
          <p className="text-muted">{t.news.empty}</p>
        ) : (
          <div className="d-flex flex-column gap-3">
            {articles.map((a, i) => (
              <a
                key={i}
                href={a.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none clean-card card shadow-sm"
              >
                <div className="card-body">
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                    {a.source && <span className="badge bg-light text-dark border">{a.source}</span>}
                    {a.isoDate && (
                      <span className="small text-muted">
                        {new Date(a.isoDate).toLocaleDateString(locale, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                  <h3 className="h6 text-dark mb-0">
                    {a.title}
                    <i className="bi bi-box-arrow-up-right ms-2 small text-muted"></i>
                  </h3>
                </div>
              </a>
            ))}
          </div>
        )}

        <p className="small text-muted mt-4">{t.news.sourceNote}</p>
      </div>
    </>
  );
}
