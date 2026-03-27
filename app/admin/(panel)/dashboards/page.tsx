import { prisma } from "@/lib/db";
import Link from "next/link";
import DashboardActions from "./DashboardActions";

export const dynamic = "force-dynamic";

export default async function AdminDashboardsPage() {
  const dashboards = await prisma.dashboard.findMany({
    orderBy: { title: "asc" },
    include: {
      topics: true,
    },
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Dashboards</h2>
        <Link href="/admin/dashboards/new" className="btn btn-blue">
          <i className="bi bi-plus-circle me-1"></i>Nuevo dashboard
        </Link>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Título</th>
                <th>Estado</th>
                <th>Temas</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {dashboards.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-muted py-4">
                    No hay dashboards aún.{" "}
                    <Link href="/admin/dashboards/new">Crear el primero</Link>
                  </td>
                </tr>
              )}
              {dashboards.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Link
                      href={`/admin/dashboards/${item.id}`}
                      className="fw-semibold text-decoration-none"
                    >
                      {item.title}
                    </Link>
                    {item.redirectUrl && (
                      <span className="ms-2 badge bg-info text-dark small">externo</span>
                    )}
                  </td>
                  <td>
                    {item.published ? (
                      <span className="badge bg-success">Publicado</span>
                    ) : (
                      <span className="badge bg-secondary">Borrador</span>
                    )}
                  </td>
                  <td className="text-muted small">{item.topics.length}</td>
                  <td className="text-end">
                    <Link
                      href={`/admin/dashboards/${item.id}`}
                      className="btn btn-sm btn-outline-primary me-1"
                    >
                      <i className="bi bi-pencil"></i>
                    </Link>
                    <DashboardActions id={item.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
