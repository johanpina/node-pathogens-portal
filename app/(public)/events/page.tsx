import { prisma } from "@/lib/db";
import PageHeader from "@/components/layout/PageHeader";
import EventCard from "@/components/cards/EventCard";
import { getLang } from "@/lib/getLang";
import { getT } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const now = new Date();
  const [upcoming, past, lang] = await Promise.all([
    prisma.event.findMany({ where: { dateStart: { gte: now } }, orderBy: { dateStart: "asc" } }),
    prisma.event.findMany({ where: { dateStart: { lt: now } }, orderBy: { dateStart: "desc" }, take: 10 }),
    getLang(),
  ]);
  const t = getT(lang);

  return (
    <>
      <PageHeader title={t.events.title} breadcrumbs={[{ label: t.events.title }]} />
      <div className="container py-5">
        {upcoming.length > 0 && (
          <section className="mb-5">
            <h3 className="section-title">{t.events.upcoming}</h3>
            {upcoming.map((ev) => (
              <EventCard key={ev.id} {...ev} moreInfoLabel={t.events.moreInfo} />
            ))}
          </section>
        )}
        {past.length > 0 && (
          <section>
            <h3 className="section-title">{t.events.past}</h3>
            {past.map((ev) => (
              <EventCard key={ev.id} {...ev} moreInfoLabel={t.events.moreInfo} />
            ))}
          </section>
        )}
        {upcoming.length === 0 && past.length === 0 && (
          <p className="text-muted">{t.events.empty}</p>
        )}
      </div>
    </>
  );
}
