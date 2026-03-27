"use client";

import { useState, useEffect, FormEvent } from "react";

interface Settings {
  site_title: string;
  site_description: string;
  contact_email: string;
  country: string;
  europepmc_query: string;
  twitter_url: string;
  github_url: string;
  umami_src: string;
  umami_website_id: string;
}

const defaultSettings: Settings = {
  site_title: "",
  site_description: "",
  contact_email: "",
  country: "",
  europepmc_query: "",
  twitter_url: "",
  github_url: "",
  umami_src: "",
  umami_website_id: "",
};

const fields: Array<{ key: keyof Settings; label: string; type?: string; placeholder?: string }> = [
  { key: "site_title", label: "Título del sitio", placeholder: "Portal de Patógenos Chile" },
  { key: "site_description", label: "Descripción", placeholder: "Portal nacional de patógenos" },
  { key: "contact_email", label: "Email de contacto", type: "email", placeholder: "contacto@example.cl" },
  { key: "country", label: "País (para Europe PMC)", placeholder: "Chile" },
  { key: "europepmc_query", label: "Query Europe PMC", placeholder: "Ej: COUNTRY:CL AND..." },
  { key: "twitter_url", label: "Twitter URL", type: "url", placeholder: "https://twitter.com/..." },
  { key: "github_url", label: "GitHub URL", type: "url", placeholder: "https://github.com/..." },
  { key: "umami_src", label: "Umami Script URL", type: "url", placeholder: "https://analytics.example.com/script.js" },
  { key: "umami_website_id", label: "Umami Website ID", placeholder: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings((prev) => ({ ...prev, ...data }));
      })
      .catch(() => setError("Error al cargar la configuración"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: keyof Settings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    setSaving(false);

    if (res.ok) {
      setSuccess("Configuración guardada exitosamente.");
      setTimeout(() => setSuccess(""), 4000);
    } else {
      const data = await res.json();
      setError(data.error ?? "Error al guardar la configuración");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <span className="spinner-border text-primary"></span>
      </div>
    );
  }

  return (
    <div>
      <h2 className="fw-bold mb-4">Configuración del sitio</h2>

      {error && (
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle me-1"></i>{error}
        </div>
      )}
      {success && (
        <div className="alert alert-success">
          <i className="bi bi-check-circle me-1"></i>{success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Site info */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white border-bottom py-3">
            <h5 className="mb-0 fw-semibold">
              <i className="bi bi-globe me-2"></i>Información general
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {fields.slice(0, 3).map(({ key, label, type, placeholder }) => (
                <div className="col-md-6" key={key}>
                  <label className="form-label fw-semibold">{label}</label>
                  <input
                    type={type ?? "text"}
                    className="form-control"
                    value={settings[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Europe PMC */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white border-bottom py-3">
            <h5 className="mb-0 fw-semibold">
              <i className="bi bi-journal-text me-2"></i>Europe PMC
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {fields.slice(3, 5).map(({ key, label, type, placeholder }) => (
                <div className="col-md-6" key={key}>
                  <label className="form-label fw-semibold">{label}</label>
                  <input
                    type={type ?? "text"}
                    className="form-control"
                    value={settings[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social links */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white border-bottom py-3">
            <h5 className="mb-0 fw-semibold">
              <i className="bi bi-share me-2"></i>Redes sociales
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {fields.slice(5, 7).map(({ key, label, type, placeholder }) => (
                <div className="col-md-6" key={key}>
                  <label className="form-label fw-semibold">{label}</label>
                  <input
                    type={type ?? "text"}
                    className="form-control"
                    value={settings[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white border-bottom py-3">
            <h5 className="mb-0 fw-semibold">
              <i className="bi bi-bar-chart me-2"></i>Analytics (Umami)
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {fields.slice(7).map(({ key, label, type, placeholder }) => (
                <div className="col-md-6" key={key}>
                  <label className="form-label fw-semibold">{label}</label>
                  <input
                    type={type ?? "text"}
                    className="form-control"
                    value={settings[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
            <div className="form-text mt-2">
              Deja en blanco para deshabilitar Umami Analytics.
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-blue px-4" disabled={saving}>
            {saving ? (
              <><span className="spinner-border spinner-border-sm me-1"></span>Guardando...</>
            ) : (
              <><i className="bi bi-save me-1"></i>Guardar configuración</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
