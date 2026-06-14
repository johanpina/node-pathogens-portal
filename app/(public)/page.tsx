import { prisma } from "@/lib/db";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import DashboardCard from "@/components/cards/DashboardCard";
import HighlightCard from "@/components/cards/HighlightCard";
import HomeAlertBanner from "@/components/public/HomeAlertBanner";
import BannerStats from "@/components/public/BannerStats";
import { getLang } from "@/lib/getLang";
import { getT } from "@/lib/i18n";
import { pick } from "@/lib/pickLang";

export const dynamic = "force-dynamic";

async function getHomeData() {
  const now = new Date();
  const [news, highlights, dashboards, events, topics, settings, epiMeta, bannerStats] =
    await Promise.all([
      prisma.news.findMany({ where: { published: true }, orderBy: { date: "desc" }, take: 5 }),
      prisma.highlight.findMany({ where: { published: true }, orderBy: { date: "desc" }, take: 3 }),
      prisma.dashboard.findMany({ where: { published: true }, orderBy: { createdAt: "asc" }, take: 3 }),
      prisma.event.findMany({ orderBy: { dateStart: "asc" } }),
      prisma.topic.findMany({ orderBy: { menuOrder: "asc" } }),
      prisma.setting.findMany({ where: { key: { in: ["site_title", "site_description"] } } }),
      prisma.epiMeta.findUnique({ where: { id: "current" } }),
      prisma.bannerStat.findMany({ orderBy: { order: "asc" } }),
    ]);

  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  const upcomingEvents = events.filter((e) => new Date(e.dateStart) >= now);

  return { news, highlights, dashboards, upcomingEvents, topics, settings: settingsMap, epiMeta, bannerStats };
}

function formatDate(date: Date | string, lang: string) {
  return new Date(date).toLocaleDateString(lang === "es" ? "es-CL" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isRecent(date: Date | string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return new Date(date) >= thirtyDaysAgo;
}

export default async function HomePage() {
  const [{ news, highlights, dashboards, upcomingEvents, topics, settings, epiMeta, bannerStats }, lang] =
    await Promise.all([getHomeData(), getLang()]);
  const t = getT(lang);

  return (
    <>
      <PageHeader title={settings.site_title ?? "Chile Pathogen Portal"} />

      {epiMeta && (
        <HomeAlertBanner
          text={pick(epiMeta, lang, "homeAlert")}
          epiWeek={epiMeta.epiWeek}
          label={t.surveillance.epiWeek}
        />
      )}
      <BannerStats
        stats={bannerStats.map((s) => ({
          id: s.id,
          value: s.value,
          label: pick(s, lang, "label"),
        }))}
      />

      <div className="container py-4">
        <div className="row">
          {/* ── Main column ── */}
          <div className="col-md-8">

            {/* Data Dashboards */}
            <section className="mb-5">
              <div className="d-flex justify-content-between align-items-baseline mb-3">
                <h2 className="section-title">{t.home.dashboardsTitle}</h2>
                <Link href="/dashboards" className="see-all-link">
                  {t.home.seeAllDashboards}
                </Link>
              </div>
              {dashboards.length > 0 ? (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                  {dashboards.map((d) => (
                    <DashboardCard key={d.id} {...d} />
                  ))}
                </div>
              ) : (
                <p className="text-muted small">{t.home.noDashboards}</p>
              )}
            </section>

            {/* Data Highlights */}
            <section className="mb-5">
              <div className="d-flex justify-content-between align-items-baseline mb-3">
                <h2 className="section-title">{t.home.highlightsTitle}</h2>
                <Link href="/highlights" className="see-all-link">
                  {t.home.seeAllHighlights}
                </Link>
              </div>
              {highlights.length > 0 ? (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                  {highlights.map((h) => (
                    <HighlightCard key={h.id} {...h} />
                  ))}
                </div>
              ) : (
                <p className="text-muted small">{t.home.noHighlights}</p>
              )}
            </section>

          </div>

          {/* ── Sidebar ── */}
          <div className="col-md-4">

            {/* Topics */}
            {topics.length > 0 && (
              <div className="sidebar-box">
                <h5>{t.home.topicsTitle}</h5>
                <p className="sidebar-desc">{t.home.topicsDesc}</p>
                {topics.map((topic) => (
                  <Link key={topic.id} href={`/topics/${topic.slug}`} className="topic-btn">
                    {topic.name}
                  </Link>
                ))}
              </div>
            )}

            {/* What's New */}
            {news.length > 0 && (
              <div className="sidebar-box">
                <h5>{t.home.whatsNew}</h5>
                <p className="sidebar-desc">{t.home.whatsNewDesc}</p>
                {news.slice(0, 4).map((n) => (
                  <div key={n.id} className="news-sidebar-item">
                    <div className="item-date">
                      {formatDate(n.date, lang)}
                      {isRecent(n.date) && (
                        <span className="badge-new">{t.common.new}</span>
                      )}
                    </div>
                    <div className="item-title">
                      <Link href={`/news/${n.slug}`}>{n.title}</Link>
                    </div>
                  </div>
                ))}
                <Link
                  href="/news"
                  className="see-all-link d-block mt-2 text-center btn btn-light btn-sm"
                >
                  {t.home.seeAllNews}
                </Link>
              </div>
            )}

            {/* Events */}
            <div className="sidebar-box">
              <h5>{t.home.eventsTitle}</h5>
              <p className="sidebar-desc">{t.home.eventsDesc}</p>
              <p className="fw-semibold small mb-1">{t.home.upcomingEvents}</p>
              {upcomingEvents.length === 0 ? (
                <p className="small text-muted">{t.home.noUpcomingEvents}</p>
              ) : (
                upcomingEvents.slice(0, 2).map((e) => {
                  const start = new Date(e.dateStart);
                  const day = start.toLocaleDateString(lang === "es" ? "es-CL" : "en-GB", { day: "2-digit" });
                  const month = start.toLocaleDateString(lang === "es" ? "es-CL" : "en-GB", { month: "short" });
                  return (
                    <div key={e.id} className="event-sidebar-item">
                      <div className="event-date-small">
                        <div className="e-day">{day}</div>
                        <div className="e-month">{month}</div>
                      </div>
                      <div>
                        <a
                          href={e.eventUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="small"
                        >
                          {e.title}
                        </a>
                        {e.venue && <div className="small text-muted">{e.venue}</div>}
                      </div>
                    </div>
                  );
                })
              )}
              <Link
                href="/events"
                className="see-all-link d-block mt-2 text-center btn btn-light btn-sm"
              >
                {t.home.seeAllEvents}
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
