"use client";

import { useEffect, useState, use } from "react";
import ChartForm, { type ChartFormData } from "@/components/admin/ChartForm";

export default function EditChartPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<ChartFormData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/surveillance/charts/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setError("No se pudo cargar el gráfico"));
  }, [id]);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!data) return <div className="text-muted">Cargando…</div>;

  return (
    <div>
      <h1 className="h3 mb-4">Editar gráfico</h1>
      <ChartForm initial={data} />
    </div>
  );
}
