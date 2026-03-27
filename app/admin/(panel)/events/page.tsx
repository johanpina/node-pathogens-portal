"use client";

import { useState, useEffect, FormEvent } from "react";

interface Event {
  id: string;
  title: string;
  type: string;
  dateStart: string;
  timeStart?: string | null;
  dateEnd?: string | null;
  timeEnd?: string | null;
  venue?: string | null;
  organisers?: string | null;
  eventUrl?: string | null;
  description?: string | null;
}

const emptyForm = {
  title: "",
  type: "Event",
  dateStart: "",
  timeStart: "",
  dateEnd: "",
  timeEnd: "",
  venue: "",
  organisers: "",
  eventUrl: "",
  description: "",
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    setLoadingList(true);
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : data.items ?? []);
    } catch {
      setError("Error al cargar eventos");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEdit = (ev: Event) => {
    setEditingId(ev.id);
    setForm({
      title: ev.title,
      type: ev.type,
      dateStart: ev.dateStart ? ev.dateStart.split("T")[0] : "",
      timeStart: ev.timeStart ?? "",
      dateEnd: ev.dateEnd ? ev.dateEnd.split("T")[0] : "",
      timeEnd: ev.timeEnd ?? "",
      venue: ev.venue ?? "",
      organisers: ev.organisers ?? "",
      eventUrl: ev.eventUrl ?? "",
      description: ev.description ?? "",
    });
    setError("");
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      title: form.title,
      type: form.type,
      dateStart: form.dateStart,
      timeStart: form.timeStart || null,
      dateEnd: form.dateEnd || null,
      timeEnd: form.timeEnd || null,
      venue: form.venue || null,
      organisers: form.organisers || null,
      eventUrl: form.eventUrl || null,
      description: form.description || null,
    };

    const url = editingId ? `/api/events/${editingId}` : "/api/events";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (res.ok) {
      await fetchEvents();
      handleCancel();
    } else {
      const data = await res.json();
      setError(data.error ?? "Error al guardar");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este evento?")) return;
    const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
    if (res.ok) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Eventos</h2>
        {!showForm && (
          <button className="btn btn-blue" onClick={openNew}>
            <i className="bi bi-plus-circle me-1"></i>Nuevo evento
          </button>
        )}
      </div>

      {/* List */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Título</th>
                <th>Tipo</th>
                <th>Fecha inicio</th>
                <th>Lugar</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loadingList && (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">
                    <span className="spinner-border spinner-border-sm me-2"></span>Cargando...
                  </td>
                </tr>
              )}
              {!loadingList && events.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">
                    No hay eventos aún.{" "}
                    <button className="btn btn-link p-0" onClick={openNew}>
                      Crear el primero
                    </button>
                  </td>
                </tr>
              )}
              {events.map((ev) => (
                <tr key={ev.id}>
                  <td className="fw-semibold">{ev.title}</td>
                  <td className="text-muted small">{ev.type}</td>
                  <td className="text-muted small">
                    {ev.dateStart
                      ? new Date(ev.dateStart).toLocaleDateString("es-CL")
                      : "-"}
                  </td>
                  <td className="text-muted small">{ev.venue ?? "-"}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => openEdit(ev)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(ev.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inline form */}
      {showForm && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom py-3">
            <h5 className="mb-0 fw-semibold">
              {editingId ? "Editar evento" : "Nuevo evento"}
            </h5>
          </div>
          <div className="card-body">
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
                    name="title"
                    className="form-control"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Tipo</label>
                  <input
                    type="text"
                    name="type"
                    className="form-control"
                    value={form.type}
                    onChange={handleChange}
                    placeholder="Event"
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Fecha inicio *</label>
                  <input
                    type="date"
                    name="dateStart"
                    className="form-control"
                    value={form.dateStart}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Hora inicio</label>
                  <input
                    type="text"
                    name="timeStart"
                    className="form-control"
                    value={form.timeStart}
                    onChange={handleChange}
                    placeholder="Ej: 10:00"
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Fecha fin</label>
                  <input
                    type="date"
                    name="dateEnd"
                    className="form-control"
                    value={form.dateEnd}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Hora fin</label>
                  <input
                    type="text"
                    name="timeEnd"
                    className="form-control"
                    value={form.timeEnd}
                    onChange={handleChange}
                    placeholder="Ej: 18:00"
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Lugar</label>
                  <input
                    type="text"
                    name="venue"
                    className="form-control"
                    value={form.venue}
                    onChange={handleChange}
                    placeholder="Ciudad, País o plataforma virtual"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Organizadores</label>
                  <input
                    type="text"
                    name="organisers"
                    className="form-control"
                    value={form.organisers}
                    onChange={handleChange}
                    placeholder="Nombre(s) del organizador"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">URL del evento</label>
                <input
                  type="url"
                  name="eventUrl"
                  className="form-control"
                  value={form.eventUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Descripción</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Descripción del evento"
                />
              </div>

              <div className="d-flex justify-content-end gap-2 border-top pt-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-blue" disabled={saving}>
                  {saving ? (
                    <><span className="spinner-border spinner-border-sm me-1"></span>Guardando...</>
                  ) : (
                    <><i className="bi bi-save me-1"></i>{editingId ? "Guardar cambios" : "Crear evento"}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
