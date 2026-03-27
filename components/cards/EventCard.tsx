import type { Lang } from "@/lib/i18n";

interface EventCardProps {
  title: string;
  type: string;
  dateStart: Date | string;
  timeStart?: string | null;
  dateEnd?: Date | string | null;
  timeEnd?: string | null;
  venue?: string | null;
  organisers?: string | null;
  eventUrl: string;
  description?: string | null;
  moreInfoLabel?: string;
  lang?: Lang;
}

export default function EventCard({
  title,
  type,
  dateStart,
  timeStart,
  dateEnd,
  venue,
  organisers,
  eventUrl,
  description,
  moreInfoLabel,
  lang = "en",
}: EventCardProps) {
  const locale = lang === "es" ? "es-CL" : "en-GB";
  const start = new Date(dateStart);
  const day = start.toLocaleDateString(locale, { day: "2-digit" });
  const month = start.toLocaleDateString(locale, { month: "short" });
  const year = start.getFullYear();
  const label = moreInfoLabel ?? (lang === "es" ? "Más info" : "More info");

  return (
    <div className="card portal-card mb-3">
      <div className="card-body">
        <div className="d-flex gap-3 align-items-start">
          <div className="event-date-badge flex-shrink-0">
            <div className="day">{day}</div>
            <div className="month">{month}</div>
            <div className="small opacity-75">{year}</div>
          </div>
          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-secondary">{type}</span>
              {timeStart && (
                <span className="small text-muted">
                  <i className="bi bi-clock me-1"></i>{timeStart}
                  {dateEnd && (() => {
                    const end = new Date(dateEnd);
                    return ` – ${end.toLocaleDateString(locale, { day: "2-digit", month: "short" })}`;
                  })()}
                </span>
              )}
            </div>
            <h6 className="mb-1">
              <a href={eventUrl} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                {title}
              </a>
            </h6>
            {venue && (
              <p className="small text-muted mb-1">
                <i className="bi bi-geo-alt me-1"></i>{venue}
              </p>
            )}
            {organisers && (
              <p className="small text-muted mb-1">
                <i className="bi bi-people me-1"></i>{organisers}
              </p>
            )}
            {description && (
              <p className="small text-muted mb-2">{description}</p>
            )}
            <a href={eventUrl} target="_blank" rel="noopener noreferrer" className="btn btn-blue btn-sm">
              {label} <i className="bi bi-box-arrow-up-right"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
