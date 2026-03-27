"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "bi-speedometer2", exact: true },
  { href: "/admin/news", label: "Noticias", icon: "bi-newspaper" },
  { href: "/admin/highlights", label: "Destacados", icon: "bi-star" },
  { href: "/admin/dashboards", label: "Dashboards", icon: "bi-bar-chart" },
  { href: "/admin/topics", label: "Tópicos", icon: "bi-tags" },
  { href: "/admin/events", label: "Eventos", icon: "bi-calendar-event" },
  { href: "/admin/users", label: "Usuarios", icon: "bi-people" },
  { href: "/admin/settings", label: "Configuración", icon: "bi-gear" },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  userName?: string;
}

export default function AdminLayout({ children, userName }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside className="admin-sidebar d-none d-lg-flex flex-column">
        <div className="p-3 border-bottom border-white border-opacity-25">
          <Link href="/" className="text-white text-decoration-none fw-bold fs-5">
            <i className="bi bi-virus me-2"></i>Portal Admin
          </Link>
        </div>

        <nav className="flex-grow-1 py-2">
          <div className="sidebar-section">Contenido</div>
          {navItems.slice(0, 6).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                item.exact
                  ? pathname === item.href
                    ? "active"
                    : ""
                  : pathname.startsWith(item.href)
                    ? "active"
                    : ""
              }
            >
              <i className={`bi ${item.icon} me-2`}></i>
              {item.label}
            </Link>
          ))}
          <div className="sidebar-section">Sistema</div>
          {navItems.slice(6).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname.startsWith(item.href) ? "active" : ""}
            >
              <i className={`bi ${item.icon} me-2`}></i>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-top border-white border-opacity-25">
          <div className="text-white-50 small mb-2">
            <i className="bi bi-person-circle me-1"></i>
            {userName ?? "Admin"}
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-outline-light btn-sm w-100"
          >
            <i className="bi bi-box-arrow-right me-1"></i>Salir
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main d-flex flex-column">
        {/* Mobile topbar */}
        <div className="admin-topbar d-flex d-lg-none align-items-center justify-content-between">
          <span className="fw-bold text-portal-primary">
            <i className="bi bi-virus me-1"></i>Portal Admin
          </span>
          <div className="dropdown">
            <button className="btn btn-sm btn-outline-secondary" data-bs-toggle="dropdown">
              <i className="bi bi-list"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link className="dropdown-item" href={item.href}>
                    <i className={`bi ${item.icon} me-2`}></i>{item.label}
                  </Link>
                </li>
              ))}
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-1"></i>Salir
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="p-4 flex-grow-1">{children}</div>
      </div>
    </div>
  );
}
