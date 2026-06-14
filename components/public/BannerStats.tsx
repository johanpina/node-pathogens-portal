export interface BannerStatItem {
  id: string;
  value: string;
  label: string;
}

export default function BannerStats({ stats }: { stats: BannerStatItem[] }) {
  if (stats.length === 0) return null;
  return (
    <div className="banner-stats bg-light border-bottom">
      <div className="container py-3">
        <div className="row text-center g-3">
          {stats.map((s) => (
            <div className="col-6 col-md-3" key={s.id}>
              <div className="fw-bold fs-4 text-primary">{s.value}</div>
              <div className="small text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
