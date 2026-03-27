"use client";

import { useRouter } from "next/navigation";

export default function HighlightActions({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este destacado?")) return;
    const res = await fetch(`/api/highlights/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  };

  return (
    <button onClick={handleDelete} className="btn btn-sm btn-outline-danger">
      <i className="bi bi-trash"></i>
    </button>
  );
}
