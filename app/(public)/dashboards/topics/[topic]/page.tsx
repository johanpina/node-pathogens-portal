import { redirect } from "next/navigation";

// Topic-filtered CMS dashboards are retired; dashboards are consolidated under
// /surveillance.
export default function DashboardTopicRedirect() {
  redirect("/surveillance");
}
