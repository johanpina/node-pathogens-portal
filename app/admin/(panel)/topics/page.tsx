import { prisma } from "@/lib/db";
import Link from "next/link";
import TopicActions from "./TopicActions";

export const dynamic = "force-dynamic";

export default async function AdminTopicsPage() {
  const topics = await prisma.topic.findMany({
    orderBy: { menuOrder: "asc" },
    include: {
      _count: {
        select: {
          highlights: true,
          dashboards: true,
        },
      },
    },
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Temas</h2>
        <Link href="/admin/topics/new" className="btn btn-blue">
          <i className="bi bi-plus-circle me-1"></i>Nuevo tema
        </Link>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Slug</th>
                <th>Orden</th>
                <th>Destacados</th>
                <th>Dashboards</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {topics.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">
                    No hay temas aún.{" "}
                    <Link href="/admin/topics/new">Crear el primero</Link>
                  </td>
                </tr>
              )}
              {topics.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Link
                      href={`/admin/topics/${item.id}`}
                      className="fw-semibold text-decoration-none"
                    >
                      {item.name}
                    </Link>
                  </td>
                  <td className="text-muted small font-monospace">{item.slug}</td>
                  <td className="text-muted small">{item.menuOrder}</td>
                  <td className="text-muted small">{item._count.highlights}</td>
                  <td className="text-muted small">{item._count.dashboards}</td>
                  <td className="text-end">
                    <Link
                      href={`/admin/topics/${item.id}`}
                      className="btn btn-sm btn-outline-primary me-1"
                    >
                      <i className="bi bi-pencil"></i>
                    </Link>
                    <TopicActions id={item.id} />
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
