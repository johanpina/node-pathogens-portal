"use client";

import { useState, useEffect } from "react";

interface Dataset {
  accession: string;
  name: string;
  description?: string;
  type?: string;
  releaseDate?: string;
}

interface DatasetsProps {
  query?: string;
}

export default function Datasets({ query = "pathogen" }: DatasetsProps) {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const url = `https://www.ebi.ac.uk/biosamples/samples?text=${encodeURIComponent(query)}&size=10`;

    fetch(url, { headers: { Accept: "application/json" } })
      .then((r) => r.json())
      .then((data) => {
        const samples = data._embedded?.samples ?? [];
        setDatasets(
          samples.map((s: Record<string, unknown>) => ({
            accession: s.accession,
            name: s.name,
            releaseDate: s.releaseDate,
          }))
        );
        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar datasets");
        setLoading(false);
      });
  }, [query]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2 text-muted">Cargando datasets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-warning">
        {error}
        <p className="mb-0 small mt-1">
          Puedes buscar directamente en{" "}
          <a href="https://www.ebi.ac.uk/biosamples/" target="_blank" rel="noopener noreferrer">
            EBI BioSamples
          </a>
        </p>
      </div>
    );
  }

  return (
    <div>
      {datasets.length === 0 ? (
        <p className="text-muted">No se encontraron datasets.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Accesión</th>
                <th>Nombre</th>
                <th>Fecha</th>
                <th>Enlace</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map((ds) => (
                <tr key={ds.accession}>
                  <td>
                    <code>{ds.accession}</code>
                  </td>
                  <td>{ds.name}</td>
                  <td className="small text-muted">{ds.releaseDate?.split("T")[0]}</td>
                  <td>
                    <a
                      href={`https://www.ebi.ac.uk/biosamples/samples/${ds.accession}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      <i className="bi bi-box-arrow-up-right"></i>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
