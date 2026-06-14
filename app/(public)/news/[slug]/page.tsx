import { redirect } from "next/navigation";

// CMS news detail is retired; news now comes from an external feed.
export default function NewsSlugRedirect() {
  redirect("/news");
}
