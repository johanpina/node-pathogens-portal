"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DiffEntry {
  file: string;
  path: string;
  before: unknown;
  after: unknown;
}
interface BundleData {
  bundle: {
    id: string;
    status: string;
    source: string;
    epiWeek: string | null;
    validationErrors: { file: string; errors: string[] }[] | null;
    createdAt: string;
    publishedAt: string | null;
  };
  diff: { newFiles: string[]; changes: DiffEntry[]; changedFiles: number };
}

function fmt(v: unknown) {
  if (v === null || v === undefined) return "—";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

export default function BundleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [data, setData] = useState<BundleData | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/surveillance/bundles/${id}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError("No se pudo cargar el bundle"));
  }, [id]);

  async function act(action: "publish" | "rollback" | "delete") {
    if (action === "delete" && !confirm("¿Borrar este bundle?")) return;
    if (action === "publish" && !confirm("¿Publicar este bundle a producción?")) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(
        action === "delete"
          ? `/api/surveillance/bundles/${id}`
          : `/api/surveillance/bundles/${id}/${action}`,
        { method: action === "delete" ? "DELETE" : "POST" }
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error ?? "Error en la operación");
        return;
      }
      if (action === "delete") router.push("/admin/surveillance");
      else router.refresh(), window.location.reload();
    } catch {
      setError("Error de red");
    } finally {
      setBusy(false);
    }
  }

  if (error && !data) return <div className="alert alert-danger">{error}</div>;
  if (!data) return <div className="text-muted">Cargando…</div>;

  const { bundle, diff } = data;
  const hasErrors = (bundle.validationErrors?.length ?? 0) > 0;
  const isPublished = bundle.status === "PUBLISHED";

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">
          Bundle {bundle.epiWeek ?? bundle.id.slice(0, 8)}{" "}
          <span className="badge bg-secondary align-middle">{bundle.status}</span>
        </h1>
        <Link href="/admin/surveillance" className="btn btn-outline-secondary btn-sm">
          ← Volver
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex gap-2 mb-4">
        {!isPublished && !hasErrors && (
          <button className="btn btn-success" disabled={busy} onClick={() => act("publish")}>
            <i className="bi bi-cloud-upload me-1"></i> Publicar
          </button>
        )}
        {bundle.status === "ARCHIVED" && (
          <button className="btn btn-warning" disabled={busy} onClick={() => act("rollback")}>
            <i className="bi bi-arrow-counterclockwise me-1"></i> Restaurar (rollback)
          </button>
        )}
        {!isPublished && (
          <button className="btn btn-outline-danger" disabled={busy} onClick={() => act("delete")}>
            <i className="bi bi-trash me-1"></i> Borrar
          </button>
        )}
      </div>

      {hasErrors && (
        <div className="card mb-4 border-warning">
          <div className="card-header bg-warning-subtle fw-semibold">
            Errores de validación — no publicable
          </div>
          <ul className="list-group list-group-flush">
            {bundle.validationErrors!.map((e, i) => (
              <li key={i} className="list-group-item">
                <code className="text-danger">{e.file}</code>
                <ul className="mb-0 small">
                  {e.errors.map((m, j) => (
                    <li key={j}>{m}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="h5">
        Cambios vs. publicado{" "}
        <span className="text-muted small">({diff.changedFiles} archivos)</span>
      </h2>

      {diff.newFiles.length > 0 && (
        <p className="small">
          Archivos nuevos: {diff.newFiles.map((f) => <code key={f} className="me-1">{f}</code>)}
        </p>
      )}

      {diff.changes.length === 0 ? (
        <p className="text-muted">Sin cambios numéricos respecto al bundle publicado.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Archivo</th>
                <th>Campo</th>
                <th>Antes</th>
                <th>Después</th>
              </tr>
            </thead>
            <tbody>
              {diff.changes.slice(0, 300).map((c, i) => (
                <tr key={i}>
                  <td className="small text-muted">{c.file.replace("data/curated/", "")}</td>
                  <td className="small font-monospace">{c.path}</td>
                  <td className="small text-danger">{fmt(c.before)}</td>
                  <td className="small text-success">{fmt(c.after)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
