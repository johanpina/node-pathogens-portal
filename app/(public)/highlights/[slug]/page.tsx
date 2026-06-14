import { redirect } from "next/navigation";

// CMS highlight detail is retired; data highlights now come from surveillance data.
export default function HighlightSlugRedirect() {
  redirect("/highlights");
}
