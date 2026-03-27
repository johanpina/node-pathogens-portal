import Link from "next/link";

interface DashboardCardProps {
  title: string;
  slug: string;
  description?: string | null;
  banner?: string | null;
  redirectUrl?: string | null;
}

export default function DashboardCard({ title, slug, description, banner, redirectUrl }: DashboardCardProps) {
  const href = redirectUrl ?? `/dashboards/${slug}`;
  const isExternal = !!redirectUrl;

  return (
    <div className="col">
      <Link
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="text-decoration-none d-block h-100"
      >
        <div className="dashboard-card h-100">
          <div className="card-img-container">
            {banner ? (
              <img src={banner} alt={title} />
            ) : (
              <i className="bi bi-bar-chart fs-1 text-muted"></i>
            )}
          </div>
          <div className="card-title-bar">{title}</div>
          {description && (
            <div className="card-body">
              <p className="small text-muted mb-0">{description}</p>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
