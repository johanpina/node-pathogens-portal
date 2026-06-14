"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/admin/ImageUpload";

interface TopicData {
  id?: string;
  name?: string;
  nameEn?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  menuOrder?: number;
  banner?: string | null;
  bannerCaption?: string | null;
}

export default function TopicForm({ initialData }: { initialData?: TopicData }) {
  const router = useRouter();
  const isEdit = !!initialData?.id;

  const [name, setName] = useState(initialData?.name ?? "");
  const [nameEn, setNameEn] = useState(initialData?.nameEn ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [descriptionEn, setDescriptionEn] = useState(initialData?.descriptionEn ?? "");
  const [menuOrder, setMenuOrder] = useState(initialData?.menuOrder ?? 0);
  const [banner, setBanner] = useState(initialData?.banner ?? "");
  const [bannerCaption, setBannerCaption] = useState(initialData?.bannerCaption ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = { name, nameEn, description, descriptionEn, menuOrder, banner, bannerCaption };

    const url = isEdit ? `/api/topics/${initialData!.id}` : "/api/topics";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin/topics");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Error al guardar");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle me-1"></i>{error}
        </div>
      )}

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <label className="form-label fw-semibold">Nombre (ES) *</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Name (EN)</label>
          <input
            type="text"
            className="form-control"
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            placeholder="English name (optional)"
          />
        </div>
        <div className="col-md-4">
          <label className="form-label fw-semibold">Orden en menú</label>
          <input
            type="number"
            className="form-control"
            value={menuOrder}
            onChange={(e) => setMenuOrder(Number(e.target.value))}
            min={0}
          />
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <label className="form-label fw-semibold">Descripción (ES)</label>
          <textarea
            className="form-control"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción del tema"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Description (EN)</label>
          <textarea
            className="form-control"
            rows={3}
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
            placeholder="English description (optional)"
          />
        </div>
      </div>

      <div className="mb-3">
        <ImageUpload value={banner} onChange={setBanner} label="Banner" />
      </div>

      <div className="mb-4">
        <label className="form-label fw-semibold">Caption del banner</label>
        <input
          type="text"
          className="form-control"
          value={bannerCaption}
          onChange={(e) => setBannerCaption(e.target.value)}
          placeholder="Créditos o descripción de la imagen"
        />
      </div>

      <div className="d-flex justify-content-end gap-2 border-top pt-3">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => router.back()}
        >
          Cancelar
        </button>
        <button type="submit" className="btn btn-blue" disabled={loading}>
          {loading ? (
            <><span className="spinner-border spinner-border-sm me-1"></span>Guardando...</>
          ) : (
            <><i className="bi bi-save me-1"></i>{isEdit ? "Guardar cambios" : "Crear tema"}</>
          )}
        </button>
      </div>
    </form>
  );
}
