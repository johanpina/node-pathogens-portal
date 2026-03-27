import { prisma } from "@/lib/db";
import Link from "next/link";
import NewsActions from "./NewsActions";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  const news = await prisma.news.findMany({
    orderBy: { date: "desc" },
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Noticias</h2>
        <Link href="/admin/news/new" className="btn btn-blue">
          <i className="bi bi-plus-circle me-1"></i>Nueva noticia
        </Link>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Título</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {news.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-muted py-4">
                    No hay noticias aún.{" "}
                    <Link href="/admin/news/new">Crear la primera</Link>
                  </td>
                </tr>
              )}
              {news.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Link href={`/admin/news/${item.id}`} className="fw-semibold text-decoration-none">
                      {item.title}
                    </Link>
                  </td>
                  <td className="text-muted small">
                    {new Date(item.date).toLocaleDateString("es-CL")}
                  </td>
                  <td>
                    {item.published ? (
                      <span className="badge bg-success">Publicado</span>
                    ) : (
                      <span className="badge bg-secondary">Borrador</span>
                    )}
                  </td>
                  <td className="text-end">
                    <Link
                      href={`/news/${item.slug}`}
                      target="_blank"
                      className="btn btn-sm btn-outline-secondary me-1"
                    >
                      <i className="bi bi-eye"></i>
                    </Link>
                    <Link href={`/admin/news/${item.id}`} className="btn btn-sm btn-outline-primary me-1">
                      <i className="bi bi-pencil"></i>
                    </Link>
                    <NewsActions id={item.id} />
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
