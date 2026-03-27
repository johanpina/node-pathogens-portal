import { prisma } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [newsCount, highlightsCount, dashboardsCount, eventsCount, topicsCount] =
    await Promise.all([
      prisma.news.count(),
      prisma.highlight.count(),
      prisma.dashboard.count(),
      prisma.event.count(),
      prisma.topic.count(),
    ]);

  const stats = [
    { label: "Noticias", count: newsCount, href: "/admin/news", icon: "bi-newspaper", color: "primary" },
    { label: "Destacados", count: highlightsCount, href: "/admin/highlights", icon: "bi-star", color: "warning" },
    { label: "Dashboards", count: dashboardsCount, href: "/admin/dashboards", icon: "bi-bar-chart", color: "success" },
    { label: "Eventos", count: eventsCount, href: "/admin/events", icon: "bi-calendar-event", color: "info" },
    { label: "Tópicos", count: topicsCount, href: "/admin/topics", icon: "bi-tags", color: "secondary" },
  ];

  return (
    <div>
      <h2 className="fw-bold mb-4">Dashboard</h2>

      <div className="row g-3 mb-4">
        {stats.map((stat) => (
          <div key={stat.href} className="col-6 col-md-4 col-lg">
            <Link href={stat.href} className="text-decoration-none">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center py-4">
                  <i className={`bi ${stat.icon} fs-1 text-${stat.color}`}></i>
                  <h3 className="fw-bold mt-2 mb-0">{stat.count}</h3>
                  <p className="text-muted small mb-0">{stat.label}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white fw-semibold">Acciones rápidas</div>
            <div className="list-group list-group-flush">
              <Link href="/admin/news/new" className="list-group-item list-group-item-action">
                <i className="bi bi-plus-circle me-2 text-success"></i>Nueva noticia
              </Link>
              <Link href="/admin/highlights/new" className="list-group-item list-group-item-action">
                <i className="bi bi-plus-circle me-2 text-warning"></i>Nuevo destacado
              </Link>
              <Link href="/admin/events" className="list-group-item list-group-item-action">
                <i className="bi bi-plus-circle me-2 text-info"></i>Nuevo evento
              </Link>
              <Link href="/admin/settings" className="list-group-item list-group-item-action">
                <i className="bi bi-gear me-2 text-secondary"></i>Configuración
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white fw-semibold">Vista del portal</div>
            <div className="list-group list-group-flush">
              {[
                { href: "/", label: "Inicio" },
                { href: "/news", label: "Noticias" },
                { href: "/highlights", label: "Destacados" },
                { href: "/events", label: "Eventos" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="list-group-item list-group-item-action"
                >
                  <i className="bi bi-box-arrow-up-right me-2"></i>{link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
