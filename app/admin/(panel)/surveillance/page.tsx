import { prisma } from "@/lib/db";
import Link from "next/link";
import GenerateDraftButton from "@/components/admin/GenerateDraftButton";

export const dynamic = "force-dynamic";

const STATUS_BADGE: Record<string, string> = {
  DRAFT: "bg-secondary",
  REVIEW: "bg-warning text-dark",
  PUBLISHED: "bg-success",
  ARCHIVED: "bg-light text-dark border",
};

export default async function AdminSurveillancePage() {
  const bundles = await prisma.pathogenBundle.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      source: true,
      epiWeek: true,
      publishedAt: true,
      createdAt: true,
    },
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Vigilancia de patógenos</h1>
        <div className="d-flex gap-2 align-items-center flex-wrap">
          <GenerateDraftButton />
          <Link href="/admin/surveillance/charts" className="btn btn-outline-secondary">
            <i className="bi bi-graph-up me-1"></i> Gráficos
          </Link>
          <Link href="/admin/surveillance/import" className="btn btn-primary">
            <i className="bi bi-upload me-1"></i> Importar bundle
          </Link>
        </div>
      </div>

      <p className="text-muted">
        Importa el bundle semanal (salida del agente IA en formato <code>### FILE:</code>),
        revisa el diff y publícalo. Solo un bundle queda publicado a la vez.
      </p>

      {bundles.length === 0 ? (
        <div className="alert alert-light border">No hay bundles aún.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Semana</th>
                <th>Estado</th>
                <th>Origen</th>
                <th>Creado</th>
                <th>Publicado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bundles.map((b) => (
                <tr key={b.id}>
                  <td>{b.epiWeek ?? "—"}</td>
                  <td>
                    <span className={`badge ${STATUS_BADGE[b.status] ?? "bg-secondary"}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="small text-muted">
                    {b.source === "AI_GENERATED" ? "IA" : "Manual"}
                  </td>
                  <td className="small text-muted">
                    {new Date(b.createdAt).toLocaleString("es-CL")}
                  </td>
                  <td className="small text-muted">
                    {b.publishedAt ? new Date(b.publishedAt).toLocaleString("es-CL") : "—"}
                  </td>
                  <td className="text-end">
                    <Link
                      href={`/admin/surveillance/${b.id}`}
                      className="btn btn-sm btn-outline-secondary"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
