import Link from "next/link";

interface HighlightCardProps {
  title: string;
  slug: string;
  date: Date | string;
  summary: string;
  banner?: string | null;
  tags?: string[];
}

export default function HighlightCard({ title, slug, date, summary, banner, tags }: HighlightCardProps) {
  const dateStr = new Date(date).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="col">
      <Link href={`/highlights/${slug}`} className="text-decoration-none d-block h-100">
        <div className="highlight-card h-100">
          {banner && (
            <div className="card-img-container">
              <img src={banner} alt={title} />
            </div>
          )}
          <div className="card-title-bar">{title}</div>
          <div className="card-body">
            <p className="small text-muted mb-1">
              <strong>{dateStr}</strong>
            </p>
            <p className="small mb-0">{summary}</p>
            {tags && tags.length > 0 && (
              <div className="mt-2">
                {tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="topic_badge">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
