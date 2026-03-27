"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ImageUpload from "@/components/admin/ImageUpload";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), {
  ssr: false,
  loading: () => <div className="border rounded p-3 text-muted">Cargando editor...</div>,
});

interface Topic {
  id: string;
  name: string;
}

interface DashboardData {
  id?: string;
  title?: string;
  description?: string | null;
  redirectUrl?: string | null;
  banner?: string | null;
  content?: string | null;
  published?: boolean;
  topics?: Array<{ topic: { id: string; name: string } }>;
}

export default function DashboardForm({ initialData }: { initialData?: DashboardData }) {
  const router = useRouter();
  const isEdit = !!initialData?.id;

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [redirectUrl, setRedirectUrl] = useState(initialData?.redirectUrl ?? "");
  const [banner, setBanner] = useState(initialData?.banner ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [topicIds, setTopicIds] = useState<string[]>(
    initialData?.topics?.map((t) => t.topic.id) ?? []
  );
  const [availableTopics, setAvailableTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/topics")
      .then((r) => r.json())
      .then((data) => setAvailableTopics(data))
      .catch(() => {});
  }, []);

  const toggleTopic = (id: string) => {
    setTopicIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      title,
      description,
      redirectUrl,
      banner,
      content,
      published,
      topicIds,
    };

    const url = isEdit ? `/api/dashboards/${initialData!.id}` : "/api/dashboards";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin/dashboards");
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

      <div className="mb-3">
        <label className="form-label fw-semibold">Título *</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Descripción</label>
        <textarea
          className="form-control"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción breve del dashboard"
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">URL externa</label>
        <input
          type="url"
          className="form-control"
          value={redirectUrl}
          onChange={(e) => setRedirectUrl(e.target.value)}
          placeholder="https://... (si el dashboard es externo)"
        />
        <div className="form-text">
          Si se proporciona, el dashboard redirigirá a esta URL en vez de mostrar contenido embebido.
        </div>
      </div>

      <div className="mb-3">
        <ImageUpload value={banner} onChange={setBanner} label="Banner" />
      </div>

      <div className="mb-3">
        <label className="form-label fw-semibold">Contenido embebido</label>
        <RichTextEditor value={content} onChange={setContent} />
        <div className="form-text">
          Opcional. Usado cuando el dashboard se muestra directamente en el sitio.
        </div>
      </div>

      {availableTopics.length > 0 && (
        <div className="mb-3">
          <label className="form-label fw-semibold">Temas</label>
          <div className="border rounded p-3 d-flex flex-wrap gap-3">
            {availableTopics.map((topic) => (
              <div key={topic.id} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`topic-${topic.id}`}
                  checked={topicIds.includes(topic.id)}
                  onChange={() => toggleTopic(topic.id)}
                />
                <label className="form-check-label" htmlFor={`topic-${topic.id}`}>
                  {topic.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="d-flex align-items-center justify-content-between gap-3 border-top pt-3 mt-4">
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
              <><i className="bi bi-save me-1"></i>{isEdit ? "Guardar cambios" : "Crear dashboard"}</>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
