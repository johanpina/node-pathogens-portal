import Link from "next/link";
import Image from "next/image";
import type { Lang } from "@/lib/i18n";

interface NewsCardProps {
  title: string;
  slug: string;
  date: Date | string;
  summary: string;
  banner?: string | null;
  compact?: boolean;
  lang?: Lang;
}

export default function NewsCard({
  title,
  slug,
  date,
  summary,
  banner,
  compact,
  lang = "en",
}: NewsCardProps) {
  const locale = lang === "es" ? "es-CL" : "en-GB";
  const d = new Date(date);
  const dateStr = d.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const readMore = lang === "es" ? "Leer más" : "Read more";

  if (compact) {
    return (
      <div className="news-sidebar-item">
        <div className="item-date">{dateStr}</div>
        <div className="item-title">
          <Link href={`/news/${slug}`}>{title}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card portal-card">
        {banner && (
          <div style={{ position: "relative", height: "180px" }}>
            <Image
              src={banner}
              alt={title}
              fill
              style={{ objectFit: "cover", borderRadius: "0.5rem 0.5rem 0 0" }}
            />
          </div>
        )}
        <div className="card-body d-flex flex-column">
          <p className="card-date mb-1">
            <i className="bi bi-calendar3 me-1"></i>{dateStr}
          </p>
          <h5 className="card-title">
            <Link href={`/news/${slug}`} className="text-decoration-none text-portal-primary">
              {title}
            </Link>
          </h5>
          <p className="card-text text-muted small flex-grow-1">{summary}</p>
          <Link href={`/news/${slug}`} className="btn btn-blue btn-sm mt-2 align-self-start">
            {readMore} <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
