"use client";

import Image from "next/image";
import { useRef, useState } from "react";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = "Imagen" }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (res.ok) {
      const { url } = await res.json();
      onChange(url);
    }
    setLoading(false);
  };

  return (
    <div>
      <label className="form-label">{label}</label>
      <div className="d-flex gap-2 align-items-start">
        <div className="flex-grow-1">
          <input
            type="text"
            className="form-control form-control-sm"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/uploads/imagen.jpg o URL externa"
          />
        </div>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm flex-shrink-0"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm"></span>
          ) : (
            <><i className="bi bi-upload me-1"></i>Subir</>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="d-none"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
            e.target.value = "";
          }}
        />
      </div>
      {value && (
        <div className="mt-2">
          <Image
            src={value}
            alt="Preview"
            width={200}
            height={120}
            style={{ objectFit: "cover", borderRadius: "0.25rem" }}
          />
          <button
            type="button"
            className="btn btn-sm btn-link text-danger p-0 ms-2"
            onClick={() => onChange("")}
          >
            <i className="bi bi-x-circle"></i> Quitar
          </button>
        </div>
      )}
    </div>
  );
}
