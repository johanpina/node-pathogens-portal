import Link from "next/link";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  banner?: string | null;
  bannerCaption?: string | null;
  breadcrumbs?: Breadcrumb[];
  children?: React.ReactNode;
}

export default function PageHeader({
  title,
  banner,
  bannerCaption,
  breadcrumbs,
  children,
}: PageHeaderProps) {
  return (
    <>
      <div
        className={`portal-banner ${banner ? "has-image" : ""}`}
        style={banner ? { backgroundImage: `url(${banner})` } : undefined}
      >
        <div className="container py-2">
          <h1 className="mb-0">{title}</h1>
          {bannerCaption && (
            <p className="banner-caption small mt-1 mb-0 opacity-75">
              {bannerCaption}
            </p>
          )}
          {children}
        </div>
      </div>

      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="portal-breadcrumb">
          <div className="container">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 small">
                <li className="breadcrumb-item">
                  <Link href="/">Inicio</Link>
                </li>
                {breadcrumbs.map((crumb, i) => (
                  <li
                    key={i}
                    className={`breadcrumb-item ${i === breadcrumbs.length - 1 ? "active" : ""}`}
                  >
                    {crumb.href && i < breadcrumbs.length - 1 ? (
                      <Link href={crumb.href}>{crumb.label}</Link>
                    ) : (
                      crumb.label
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
