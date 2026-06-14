"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PATHOGEN_IDS } from "@/lib/surveillance/schemas";

export interface ChartFormData {
  id?: string;
  pathogenId: string;
  order: number;
  kind: string;
  titleEs: string;
  titleEn: string;
  config: unknown;
  narrativeEs?: string | null;
  narrativeEn?: string | null;
}

export default function ChartForm({ initial }: { initial?: ChartFormData }) {
  const router = useRouter();
  const isEdit = !!initial?.id;
  const [pathogenId, setPathogenId] = useState(initial?.pathogenId ?? PATHOGEN_IDS[0]);
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [kind, setKind] = useState(initial?.kind ?? "bar");
  const [titleEs, setTitleEs] = useState(initial?.titleEs ?? "");
  const [titleEn, setTitleEn] = useState(initial?.titleEn ?? "");
  const [narrativeEs, setNarrativeEs] = useState(initial?.narrativeEs ?? "");
  const [narrativeEn, setNarrativeEn] = useState(initial?.narrativeEn ?? "");
  const [configText, setConfigText] = useState(
    JSON.stringify(initial?.config ?? { type: "bar", data: { labels: [], datasets: [] } }, null, 2)
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError("");
    let config: unknown;
    try {
      config = JSON.parse(configText);
    } catch {
      setError("El JSON de configuración no es válido.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(
        isEdit ? `/api/surveillance/charts/${initial!.id}` : "/api/surveillance/charts",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pathogenId,
            order,
            kind,
            titleEs,
            titleEn,
            narrativeEs,
            narrativeEn,
            config,
          }),
        }
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error ?? "Error al guardar");
        return;
      }
      router.push("/admin/surveillance/charts");
      router.refresh();
    } catch {
      setError("Error de red");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="row g-3" style={{ maxWidth: 900 }}>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="col-md-4">
        <label className="form-label">Patógeno</label>
        <select className="form-select" value={pathogenId} onChange={(e) => setPathogenId(e.target.value)}>
          {PATHOGEN_IDS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
      <div className="col-md-4">
        <label className="form-label">Tipo</label>
        <select className="form-select" value={kind} onChange={(e) => setKind(e.target.value)}>
          {["line", "bar", "doughnut", "pie"].map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
      </div>
      <div className="col-md-4">
        <label className="form-label">Orden</label>
        <input type="number" className="form-control" value={order} onChange={(e) => setOrder(Number(e.target.value))} />
      </div>
      <div className="col-md-6">
        <label className="form-label">Título (ES)</label>
        <input className="form-control" value={titleEs} onChange={(e) => setTitleEs(e.target.value)} />
      </div>
      <div className="col-md-6">
        <label className="form-label">Title (EN)</label>
        <input className="form-control" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
      </div>
      <div className="col-12">
        <label className="form-label">
          Configuración Chart.js (JSON con <code>type</code>, <code>data</code>, <code>options</code>)
        </label>
        <textarea
          className="form-control font-monospace"
          rows={14}
          value={configText}
          onChange={(e) => setConfigText(e.target.value)}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">Narrativa (ES) — opcional</label>
        <textarea className="form-control" rows={3} value={narrativeEs ?? ""} onChange={(e) => setNarrativeEs(e.target.value)} />
      </div>
      <div className="col-md-6">
        <label className="form-label">Narrative (EN) — opcional</label>
        <textarea className="form-control" rows={3} value={narrativeEn ?? ""} onChange={(e) => setNarrativeEn(e.target.value)} />
      </div>
      <div className="col-12 d-flex gap-2">
        <button className="btn btn-primary" disabled={busy} onClick={submit}>
          {busy ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear gráfico"}
        </button>
        <button className="btn btn-outline-secondary" onClick={() => router.push("/admin/surveillance/charts")}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
