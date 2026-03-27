"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.error ?? "Error al iniciar sesión");
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: "linear-gradient(135deg, #295986 0%, #193f90 100%)" }}
    >
      <div className="card shadow-lg" style={{ width: "100%", maxWidth: "420px" }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <i className="bi bi-virus fs-1 text-portal-primary"></i>
            <h4 className="mt-2 fw-bold text-portal-primary">Portal Admin</h4>
            <p className="text-muted small">Ingresa tus credenciales</p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 small">
              <i className="bi bi-exclamation-triangle me-1"></i>{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pathogens.cl"
                required
                autoComplete="email"
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold">Contraseña</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="btn btn-blue w-100"
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Ingresando...</>
              ) : (
                <><i className="bi bi-box-arrow-in-right me-1"></i>Ingresar</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
