"use client";

import { useRouter } from "next/navigation";

export default function TopicActions({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este tema? También se eliminarán sus asociaciones con destacados y dashboards.")) return;
    const res = await fetch(`/api/topics/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  };

  return (
    <button onClick={handleDelete} className="btn btn-sm btn-outline-danger">
      <i className="bi bi-trash"></i>
    </button>
  );
}
