interface HomeAlertBannerProps {
  text: string;
  epiWeek: string;
  label: string;
}

export default function HomeAlertBanner({ text, epiWeek, label }: HomeAlertBannerProps) {
  if (!text) return null;
  return (
    <div className="alert alert-warning border-0 rounded-0 mb-0" role="alert">
      <div className="container d-flex align-items-center gap-2 py-1">
        <i className="bi bi-exclamation-triangle-fill"></i>
        <span className="badge bg-warning text-dark">
          {label} {epiWeek}
        </span>
        <span className="small mb-0">{text}</span>
      </div>
    </div>
  );
}
