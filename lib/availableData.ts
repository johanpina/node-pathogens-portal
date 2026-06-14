/**
 * "Available data" links to the Central Pathogens Portal (EMBL-EBI,
 * pathogensportal.org), mirroring the Swedish portal's available-data page but
 * filtered for Chile. Each link runs a country-scoped query in the central
 * portal: pathogensportal.org/<path>?db=<db>&query=(country:"<Country>").
 */

export interface DataLink {
  labelEs: string;
  labelEn: string;
  path: string;
  db: string;
}

export interface DataSection {
  titleEs: string;
  titleEn: string;
  links: DataLink[];
}

export const DATA_SECTIONS: DataSection[] = [
  {
    titleEs: "Brotes",
    titleEn: "Outbreaks",
    links: [
      { labelEs: "Brotes", labelEn: "Outbreaks", path: "/priority-pathogens", db: "priorityPathogens" },
      { labelEs: "Secuencias", labelEn: "Sequences", path: "/priority-pathogens", db: "embl-pathogen" },
      { labelEs: "Análisis", labelEn: "Analysis", path: "/priority-pathogens", db: "sra-analysis" },
      { labelEs: "Lecturas crudas", labelEn: "Raw Reads", path: "/priority-pathogens", db: "sra-experiment" },
      { labelEs: "Muestras", labelEn: "Samples", path: "/priority-pathogens", db: "sra-sample" },
      { labelEs: "Ensamblados", labelEn: "Assembly", path: "/priority-pathogens", db: "genome_assembly" },
    ],
  },
  {
    titleEs: "Secuencias de patógenos",
    titleEn: "Pathogens Sequences",
    links: [
      { labelEs: "Secuencias de patógenos", labelEn: "Pathogens Sequences", path: "/sequences", db: "sequences" },
      { labelEs: "Secuencia", labelEn: "Sequence", path: "/sequences", db: "embl-pathogen" },
      { labelEs: "Análisis", labelEn: "Analysis", path: "/sequences", db: "sra-analysis" },
      { labelEs: "Lecturas crudas", labelEn: "Raw Reads", path: "/sequences", db: "sra-experiment" },
      { labelEs: "Ensamblados", labelEn: "Assembly", path: "/sequences", db: "genome_assembly" },
    ],
  },
  {
    titleEs: "Muestras",
    titleEn: "Samples",
    links: [
      { labelEs: "Muestras", labelEn: "Samples", path: "/samples", db: "samples" },
    ],
  },
];

const PORTAL_BASE = "https://www.pathogensportal.org";

/** Build a country-scoped Central Pathogens Portal query URL. */
export function dataUrl(path: string, db: string, country: string): string {
  const query = encodeURIComponent(`(country:"${country}")`);
  return `${PORTAL_BASE}${path}?db=${db}&query=${query}`;
}
