/**
 * Simple mosquito glyph (Bootstrap Icons has no mosquito). Monochrome — uses
 * the given `color` via currentColor so it matches the pathogen accent.
 * Used for vector-borne pathogens like dengue.
 */
export default function MosquitoIcon({
  color,
  size = 28,
  className,
}: {
  color?: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={{ color, display: "inline-block", verticalAlign: "middle" }}
      role="img"
      aria-label="mosquito"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* wing */}
      <path
        d="M9.5 8 C13 3 20 4 19 8 C18.4 10 12 10 9.5 8 Z"
        fill="currentColor"
        fillOpacity="0.28"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      {/* abdomen + thorax + head */}
      <ellipse
        cx="13.5"
        cy="12.5"
        rx="4.6"
        ry="1.8"
        transform="rotate(35 13.5 12.5)"
        fill="currentColor"
      />
      <circle cx="8" cy="9" r="2" fill="currentColor" />
      {/* proboscis */}
      <line x1="6.6" y1="9.6" x2="2.4" y2="13.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      {/* antennae */}
      <line x1="7" y1="7.4" x2="5.6" y2="3.8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="8.6" y1="7.2" x2="8.7" y2="3.6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      {/* legs */}
      <g stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none">
        <path d="M10 11 C8 15 6 17 4 18" />
        <path d="M12 12 C12 16 11 19 9 21" />
        <path d="M14 13 C16 16 18 17.5 20 18.5" />
        <path d="M14.5 12 C17 13 19 13 22 11.6" />
      </g>
    </svg>
  );
}
