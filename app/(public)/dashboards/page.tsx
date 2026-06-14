import { redirect } from "next/navigation";

// Dashboards are now consolidated under /surveillance (Our + External dashboards),
// matching the Swedish portal's information architecture.
export default function DashboardsRedirect() {
  redirect("/surveillance");
}
