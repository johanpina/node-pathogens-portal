import { prisma } from "@/lib/db";
import Link from "next/link";
import PathogenCard from "@/components/cards/PathogenCard";
import HomeAlertBanner from "@/components/public/HomeAlertBanner";
import { getLang } from "@/lib/getLang";
import { getT, type Lang } from "@/lib/i18n";
import { pick } from "@/lib/pickLang";
import { mapLink } from "@/lib/surveillance/linkMap";
import { fetchNews, DEFAULT_NEWS_QUERY, DEFAULT_NEWS_QUERY_EN } from "@/lib/news";

export const dynamic = "force-dynamic";

async function getHomeData(lang: Lang) {
  const [pathogens, highlights, topics, settings, epiMeta, bannerStats] =
    await Promise.all([
      prisma.pathogen.findMany({
        orderBy: { order: "asc" },
        include: { stats: { where: { kind: "card" }, orderBy: { order: "asc" } } },
      }),
      prisma.surveillanceHighlight.findMany({ orderBy: { order: "asc" }, take: 3 }),
      prisma.topic.findMany({ orderBy: { menuOrder: "asc" } }),
      prisma.setting.findMany({
        where: { key: { in: ["site_title", "site_description", "news_query"] } },
      }),
      prisma.epiMeta.findUnique({ where: { id: "current" } }),
      prisma.bannerStat.findMany({ orderBy: { order: "asc" } }),
    ]);
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  const query =
    lang === "en" ? DEFAULT_NEWS_QUERY_EN : settingsMap.news_query || DEFAULT_NEWS_QUERY;
  const news = await fetchNews(query, 5, lang);
  return { pathogens, highlights, topics, news, settings: settingsMap, epiMeta, bannerStats };
}

export default async function HomePage() {
  const lang = await getLang();
  const { pathogens, highlights, topics, news, settings, epiMeta, bannerStats } =
    await getHomeData(lang);
  const t = getT(lang);

  return (
    <>
      {epiMeta && (
        <HomeAlertBanner
          text={pick(epiMeta, lang, "homeAlert")}
          epiWeek={epiMeta.epiWeek}
          label={t.surveillance.epiWeek}
        />
      )}

      {/* ── Hero ── */}
      <section className="portal-hero">
        <div className="container">
          <h1>{settings.site_title ?? "Portal de Patógenos Chile"}</h1>
          <p className="hero-subtitle">
            {settings.site_description ??
              "Vigilancia, identificación e investigación de patógenos en Chile."}
          </p>
          <Link href="/topics" className="btn-accent">
            {t.home.topicsTitle} <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
      </section>

      {/* ── Banner stats strip ── */}
      {bannerStats.length > 0 && (
        <div className="hero-stats">
          <div className="container">
            <div className="row text-center g-3">
              {bannerStats.map((s) => (
                <div className="col-6 col-md-3" key={s.id}>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{pick(s, lang, "label")}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="container py-5">
        <div className="row g-5">
          {/* ── Main column ── */}
          <div className="col-lg-8">
            {/* Dashboards */}
            <section className="mb-5">
              <div className="section-head">
                <h2 className="section-title">{t.nav.dataDashboards}</h2>
                <Link href="/surveillance" className="see-all-link">
                  {t.home.seeAllDashboards}
                </Link>
              </div>
              <p className="section-intro">{t.surveillance.intro}</p>
              <div className="row row-cols-1 row-cols-md-2 g-4">
                {pathogens.slice(0, 4).map((p) => (
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
            </section>

            {/* Data Highlights */}
            <section className="mb-5">
              <div className="section-head">
                <h2 className="section-title">{t.home.highlightsTitle}</h2>
                <Link href="/highlights" className="see-all-link">
                  {t.home.seeAllHighlights}
                </Link>
              </div>
              {highlights.length > 0 ? (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                  {highlights.map((h) => (
                    <div className="col" key={h.id}>
                      <Link href={mapLink(h.link)} className="text-decoration-none d-block h-100">
                        <div className="card h-100 shadow-sm clean-card">
                          <div className="card-body">
                            <div className="display-6 fw-bold text-primary">{h.metricValue}</div>
                            <div className="small text-muted mb-2">{pick(h, lang, "metricLabel")}</div>
                            <p className="text-dark mb-0 small">{pick(h, lang, "title")}</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted small">{t.home.noHighlights}</p>
              )}
            </section>

            {/* Explore Topics */}
            {topics.length > 0 && (
              <section>
                <div className="section-head">
                  <h2 className="section-title">{t.home.topicsTitle}</h2>
                  <Link href="/topics" className="see-all-link">
                    {t.home.seeAllHighlights}
                  </Link>
                </div>
                <p className="section-intro">{t.home.topicsDesc}</p>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                  {topics.map((topic) => (
                    <div className="col" key={topic.id}>
                      <Link href={`/topics/${topic.slug}`} className="text-decoration-none">
                        <div className="topic-tile">
                          <i className="bi bi-diagram-3 me-2"></i>
                          {topic.name}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── Sidebar: News & Updates ── */}
          <div className="col-lg-4">
            <div className="news-card">
              <div className="news-card-head">
                <span>{t.home.whatsNew}</span>
                <Link href="/news">{t.home.seeAllNews}</Link>
              </div>
              <div className="news-card-body">
                {news.length === 0 ? (
                  <p className="small text-muted mb-0">{t.news.empty}</p>
                ) : (
                  news.map((n, i) => (
                    <div className="news-item" key={i}>
                      <div className="news-item-date">{n.source}</div>
                      <a
                        href={n.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="news-item-title"
                      >
                        {n.title}
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
