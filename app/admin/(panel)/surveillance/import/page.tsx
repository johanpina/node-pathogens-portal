"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FileError {
  file: string;
  errors: string[];
}

export default function ImportBundlePage() {
  const router = useRouter();
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    id: string;
    valid: boolean;
    fileCount: number;
    epiWeek: string | null;
    errors: FileError[];
  } | null>(null);
  const [error, setError] = useState("");

  async function handleValidate() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/surveillance/bundles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al validar");
        return;
      }
      setResult(data);
    } catch {
      setError("Error de red");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Importar bundle semanal</h1>
        <Link href="/admin/surveillance" className="btn btn-outline-secondary btn-sm">
          ← Volver
        </Link>
      </div>

      <p className="text-muted">
        Pega la respuesta del agente (bloques <code>### FILE: data/curated/...json</code>).
        Se valida con el contrato; <strong>no se publica nada</strong> hasta que revises el diff.
      </p>

      <textarea
        className="form-control font-monospace"
        rows={16}
        placeholder="### FILE: data/curated/meta.json&#10;```json&#10;{ ... }&#10;```"
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
      />

      <div className="d-flex gap-2 mt-3">
        <button
          className="btn btn-primary"
          onClick={handleValidate}
          disabled={loading || markdown.trim().length === 0}
        >
          {loading ? "Validando…" : "Validar"}
        </button>
      </div>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {result && (
        <div className="mt-4">
          {result.valid ? (
            <div className="alert alert-success">
              <i className="bi bi-check-circle me-1"></i>
              Bundle válido — {result.fileCount} archivos, semana {result.epiWeek ?? "?"}.
              Guardado como <strong>REVIEW</strong>.
              <div className="mt-2">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => router.push(`/admin/surveillance/${result.id}`)}
                >
                  Revisar diff y publicar →
                </button>
              </div>
            </div>
          ) : (
            <div className="alert alert-warning">
              <i className="bi bi-exclamation-triangle me-1"></i>
              Bundle con errores ({result.fileCount} archivos detectados). Corrige y vuelve a validar.
            </div>
          )}

          {result.errors.length > 0 && (
            <div className="card">
              <div className="card-header fw-semibold">Errores de validación</div>
              <ul className="list-group list-group-flush">
                {result.errors.map((e, i) => (
                  <li key={i} className="list-group-item">
                    <code className="text-danger">{e.file}</code>
                    <ul className="mb-0 small">
                      {e.errors.map((msg, j) => (
                        <li key={j}>{msg}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
