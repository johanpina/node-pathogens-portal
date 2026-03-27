import { cookies } from "next/headers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Lang } from "@/lib/i18n";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const lang: Lang = cookieStore.get("lang")?.value === "es" ? "es" : "en";

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar lang={lang} />
      <main className="flex-grow-1">{children}</main>
      <Footer />
    </div>
  );
}
