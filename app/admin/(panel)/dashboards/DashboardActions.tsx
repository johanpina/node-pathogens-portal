"use client";

import { useRouter } from "next/navigation";

export default function DashboardActions({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este dashboard?")) return;
    const res = await fetch(`/api/dashboards/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  };

  return (
    <button onClick={handleDelete} className="btn btn-sm btn-outline-danger">
      <i className="bi bi-trash"></i>
    </button>
  );
}
