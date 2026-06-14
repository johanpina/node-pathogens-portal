import Link from "next/link";

export interface PathogenCardStat {
  value: string;
  label: string;
}

interface PathogenCardProps {
  id: string;
  name: string;
  status: string;
  statusLabel: string;
  icon: string;
  color: string;
  summary: string;
  stats: PathogenCardStat[];
  detailLabel: string;
}

export default function PathogenCard({
  id,
  name,
  statusLabel,
  icon,
  color,
  summary,
  stats,
  detailLabel,
}: PathogenCardProps) {
  return (
    <div className="col">
      <Link
        href={`/surveillance/${id}`}
        className="text-decoration-none d-block h-100"
      >
        <div
          className="card h-100 shadow-sm pathogen-card"
          style={{ borderTop: `4px solid ${color}` }}
        >
          <div className="card-body d-flex flex-column">
            <div className="d-flex align-items-center mb-2">
              <i className={`bi ${icon} fs-3 me-2`} style={{ color }}></i>
              <h3 className="h6 mb-0 flex-grow-1 text-dark">{name}</h3>
              <span
                className="badge rounded-pill"
                style={{ backgroundColor: color }}
              >
                {statusLabel}
              </span>
            </div>

            <div className="row text-center g-2 my-2">
              {stats.map((s, i) => (
                <div className="col" key={i}>
                  <div className="fw-bold fs-5" style={{ color }}>
                    {s.value}
                  </div>
                  <div className="small text-muted lh-sm">{s.label}</div>
                </div>
              ))}
            </div>

            <p className="small text-muted flex-grow-1">{summary}</p>
            <span className="small fw-semibold" style={{ color }}>
              {detailLabel}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
