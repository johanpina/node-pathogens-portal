import { redirect } from "next/navigation";

// Topic-filtered CMS highlights are retired; redirect to the highlights index.
export default function HighlightTopicRedirect() {
  redirect("/highlights");
}
