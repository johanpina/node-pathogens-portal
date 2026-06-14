/** Icon + accent colour per topic slug (used for the card header thumbnail). */
export const TOPIC_VISUAL: Record<string, { icon: string; color: string }> = {
  "respiratory-viruses": { icon: "bi-lungs", color: "#2563eb" },
  "vector-borne-diseases": { icon: "bi-bug", color: "#ea580c" },
  "antimicrobial-resistance": { icon: "bi-shield-shaded", color: "#475569" },
  "foodborne-pathogens": { icon: "bi-cup-straw", color: "#0891b2" },
  "emerging-pathogens": { icon: "bi-virus", color: "#9333ea" },
};

export function topicVisual(slug: string): { icon: string; color: string } {
  return TOPIC_VISUAL[slug] ?? { icon: "bi-diagram-3", color: "#16548a" };
}
