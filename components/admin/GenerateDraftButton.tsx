"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GenerateDraftButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function generate() {
    if (
      !confirm(
        "¿Generar un borrador con IA (Claude + búsqueda web)? Puede tardar unos minutos. " +
          "El resultado queda como borrador en revisión; no se publica solo."
      )
    )
      return;
    setBusy(true);
    setMsg("Generando con IA… (esto puede tardar 1–3 min)");
    try {
      const res = await fetch("/api/surveillance/generate", { method: "POST" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(`Error: ${body.error ?? "no se pudo generar"}`);
        return;
      }
      if (body.id) {
        router.push(`/admin/surveillance/${body.id}`);
        return;
      }
      setMsg("Generado.");
      router.refresh();
    } catch {
      setMsg("Error de red");
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="d-inline-flex align-items-center gap-2">
      {msg && <span className="small text-muted">{msg}</span>}
      <button className="btn btn-outline-primary" onClick={generate} disabled={busy}>
        <i className="bi bi-robot me-1"></i>
        {busy ? "Generando…" : "Generar con IA"}
      </button>
    </span>
  );
}
