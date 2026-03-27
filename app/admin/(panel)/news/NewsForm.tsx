"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ImageUpload from "@/components/admin/ImageUpload";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), {
  ssr: false,
  loading: () => <div className="border rounded p-3 text-muted">Cargando editor...</div>,
});

interface NewsData {
  id?: string;
  title?: string;
  date?: Date | string;
  summary?: string;
  banner?: string | null;
  bannerLarge?: string | null;
  bannerCaption?: string | null;
  content?: string;
  published?: boolean;
  slug?: string;
}

export default function NewsForm({ initialData }: { initialData?: NewsData }) {
  const router = useRouter();
  const isEdit = !!initialData?.id;

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [date, setDate] = useState(
    initialData?.date
      ? new Date(initialData.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [summary, setSummary] = useState(initialData?.summary ?? "");
  const [banner, setBanner] = useState(initialData?.banner ?? "");
  const [bannerLarge, setBannerLarge] = useState(initialData?.bannerLarge ?? "");
  const [bannerCaption, setBannerCaption] = useState(initialData?.bannerCaption ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = { title, date, summary, banner, bannerLarge, bannerCaption, content, published };

    const url = isEdit ? `/api/news/${initialData.id}` : "/api/news";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin/news");
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
        <div className="col-md-8">
          <label className="form-label fw-semibold">Título *</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="col-md-4">
          <label className="form-label fw-semibold">Fecha *</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Resumen *</label>
        <textarea
          className="form-control"
          rows={2}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
        />
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <ImageUpload value={banner} onChange={setBanner} label="Banner" />
        </div>
        <div className="col-md-6">
          <ImageUpload value={bannerLarge} onChange={setBannerLarge} label="Banner grande" />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Caption del banner</label>
        <input
          type="text"
          className="form-control"
          value={bannerCaption}
          onChange={(e) => setBannerCaption(e.target.value)}
          placeholder="Créditos o descripción de la imagen"
        />
      </div>

      <div className="mb-4">
        <label className="form-label fw-semibold">Contenido *</label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <div className="d-flex align-items-center justify-content-between gap-3 border-top pt-3">
        <div className="form-check form-switch">
          <input
            type="checkbox"
            className="form-check-input"
            id="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          <label className="form-check-label fw-semibold" htmlFor="published">
            {published ? "Publicado" : "Borrador"}
          </label>
        </div>

        <div className="d-flex gap-2">
          {isEdit && initialData?.slug && (
            <a
              href={`/news/${initialData.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-secondary"
            >
              <i className="bi bi-eye me-1"></i>Preview
            </a>
          )}
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
              <><i className="bi bi-save me-1"></i>{isEdit ? "Guardar cambios" : "Crear noticia"}</>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
