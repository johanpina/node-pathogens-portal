"use client";

import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartType } from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend
);

export interface ChartItem {
  id: string;
  kind: string;
  title: string;
  narrative?: string | null;
  config: { type: string; data: unknown; options?: unknown };
}

export default function PathogenCharts({ charts }: { charts: ChartItem[] }) {
  if (charts.length === 0) return null;

  // The first chart that carries narrative shows it as a section intro.
  const intro = charts.find((c) => c.narrative)?.narrative;

  return (
    <section className="mb-5">
      {intro && <p className="text-muted">{intro}</p>}
      <div className="row row-cols-1 row-cols-lg-2 g-4">
        {charts.map((c) => (
          <div className="col" key={c.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h3 className="h6 mb-3">{c.title}</h3>
                <div style={{ position: "relative", height: 280 }}>
                  <Chart
                    type={c.kind as ChartType}
                    data={c.config.data as never}
                    options={(c.config.options ?? {}) as never}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
