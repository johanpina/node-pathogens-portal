"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Chart {
  id: string;
  pathogenId: string;
  order: number;
  kind: string;
  titleEs: string;
}

export default function AdminChartsPage() {
  const [charts, setCharts] = useState<Chart[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    fetch("/api/surveillance/charts")
      .then((r) => r.json())
      .then((d) => setCharts(d))
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function del(id: string) {
    if (!confirm("¿Borrar este gráfico?")) return;
    await fetch(`/api/surveillance/charts/${id}`, { method: "DELETE" });
    load();
  }

  const byPathogen = charts.reduce<Record<string, Chart[]>>((acc, c) => {
    (acc[c.pathogenId] ??= []).push(c);
    return acc;
  }, {});

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Gráficos de patógenos</h1>
        <div className="d-flex gap-2">
          <Link href="/admin/surveillance" className="btn btn-outline-secondary btn-sm">
            ← Vigilancia
          </Link>
          <Link href="/admin/surveillance/charts/new" className="btn btn-primary">
            <i className="bi bi-plus-lg me-1"></i> Nuevo gráfico
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-muted">Cargando…</p>
      ) : charts.length === 0 ? (
        <div className="alert alert-light border">No hay gráficos aún.</div>
      ) : (
        Object.entries(byPathogen).map(([pid, list]) => (
          <div key={pid} className="mb-4">
            <h2 className="h6 text-uppercase text-muted">{pid}</h2>
            <table className="table table-sm table-hover align-middle">
              <tbody>
                {list.map((c) => (
                  <tr key={c.id}>
                    <td style={{ width: 60 }} className="text-muted">#{c.order}</td>
                    <td><span className="badge bg-light text-dark border">{c.kind}</span></td>
                    <td>{c.titleEs}</td>
                    <td className="text-end">
                      <Link href={`/admin/surveillance/charts/${c.id}`} className="btn btn-sm btn-outline-secondary me-1">
                        Editar
                      </Link>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => del(c.id)}>
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}
