"use client";

import { useRouter } from "next/navigation";
import type { Lang } from "@/lib/i18n";

export default function LanguageSwitcher({ lang }: { lang: Lang }) {
  const router = useRouter();

  function toggle() {
    const newLang: Lang = lang === "en" ? "es" : "en";
    document.cookie = `lang=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      className="border-0 bg-transparent nav-link py-0 px-2"
      title={lang === "en" ? "Switch to Spanish" : "Cambiar a inglés"}
      style={{ fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}
    >
      {lang === "en" ? "ES" : "EN"}
    </button>
  );
}
