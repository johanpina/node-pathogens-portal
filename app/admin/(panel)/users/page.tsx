"use client";

import { useState, useEffect, FormEvent } from "react";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // New user form state
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("EDITOR");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("No autorizado");
      const data = await res.json();
      setUsers(data.users ?? []);
      setCurrentUserId(data.currentUserId ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, password, role }),
    });

    setSaving(false);

    if (res.ok) {
      setSuccess("Usuario creado exitosamente.");
      setEmail("");
      setName("");
      setPassword("");
      setRole("EDITOR");
      await fetchUsers();
      setTimeout(() => setSuccess(""), 3000);
    } else {
      const data = await res.json();
      setFormError(data.error ?? "Error al crear usuario");
    }
  };

  const handleDelete = async (id: string) => {
    if (id === currentUserId) return;
    if (!confirm("¿Eliminar este usuario?")) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  return (
    <div>
      <h2 className="fw-bold mb-4">Usuarios</h2>

      {error && (
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle me-1"></i>{error}
        </div>
      )}

      {/* User list */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Creado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">
                    <span className="spinner-border spinner-border-sm me-2"></span>Cargando...
                  </td>
                </tr>
              )}
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">
                    No hay usuarios.
                  </td>
                </tr>
              )}
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="fw-semibold">
                    {user.name ?? <span className="text-muted fst-italic">Sin nombre</span>}
                    {user.id === currentUserId && (
                      <span className="ms-2 badge bg-primary">Tú</span>
                    )}
                  </td>
                  <td className="text-muted small">{user.email}</td>
                  <td>
                    {user.role === "ADMIN" ? (
                      <span className="badge bg-danger">Admin</span>
                    ) : (
                      <span className="badge bg-secondary">Editor</span>
                    )}
                  </td>
                  <td className="text-muted small">
                    {new Date(user.createdAt).toLocaleDateString("es-CL")}
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(user.id)}
                      disabled={user.id === currentUserId}
                      title={user.id === currentUserId ? "No puedes eliminarte a ti mismo" : "Eliminar"}
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

      {/* Add user form */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom py-3">
          <h5 className="mb-0 fw-semibold">
            <i className="bi bi-person-plus me-2"></i>Agregar usuario
          </h5>
        </div>
        <div className="card-body">
          {success && (
            <div className="alert alert-success">
              <i className="bi bi-check-circle me-1"></i>{success}
            </div>
          )}
          {formError && (
            <div className="alert alert-danger">
              <i className="bi bi-exclamation-triangle me-1"></i>{formError}
            </div>
          )}
          <form onSubmit={handleCreate}>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Email *</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Contraseña *</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <div className="form-text">Mínimo 8 caracteres.</div>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Rol</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="EDITOR">Editor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-blue" disabled={saving}>
                {saving ? (
                  <><span className="spinner-border spinner-border-sm me-1"></span>Creando...</>
                ) : (
                  <><i className="bi bi-person-plus me-1"></i>Crear usuario</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
