/**
 * Javier's bundle links look like "pathogens/influenza.html". Map them to the
 * portal's routes ("/surveillance/influenza"). Anything else is returned as-is
 * (prefixed with "/" if it isn't already absolute).
 */
export function mapLink(link: string): string {
  const m = link.match(/pathogens\/([a-z0-9]+)\.html$/i);
  if (m) return `/surveillance/${m[1]}`;
  if (/^https?:\/\//.test(link)) return link;
  return link.startsWith("/") ? link : `/${link}`;
}
