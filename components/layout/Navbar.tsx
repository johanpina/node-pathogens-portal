"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getT, type Lang } from "@/lib/i18n";

export default function Navbar({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const t = getT(lang);

  const mainNavLinks = [
    { href: "/surveillance", label: t.nav.dataDashboards },
    { href: "/topics", label: t.nav.topics },
    { href: "/highlights", label: t.nav.dataHighlights },
    { href: "/datasets", label: t.nav.datasets },
    { href: "/publications", label: t.nav.publications },
  ];

  const topNavLinks = [
    { href: "/about", label: t.nav.about },
    { href: "/contact", label: t.nav.contact },
  ];

  function isActive(href: string) {
    return pathname.startsWith(href);
  }

  return (
    <header>
      {/* Top bar */}
      <div className="portal-navbar-top">
        <div className="container d-flex align-items-center py-2">
          {/* Logo Pathogens */}
          <Link href="/" className="d-flex align-items-center me-3 text-decoration-none">
            <img
              src="/img/pathogens_logo.svg"
              alt="Pathogens Portal"
              style={{ height: 50, width: "auto" }}
            />
          </Link>

          {/* Institution logo */}
          <img
            src="/images/logos/logo_uchile.png"
            alt="Universidad de Chile"
            className="d-none d-md-block"
            style={{ height: 45, width: "auto" }}
          />

          {/* Hamburger (mobile) */}
          <button
            className="ms-auto d-lg-none border-0 bg-transparent p-1"
            type="button"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
          >
            <i className={`bi ${open ? "bi-x-lg" : "bi-list"} fs-2`}></i>
          </button>

          {/* Top links — desktop */}
          <nav className="ms-auto d-none d-lg-flex align-items-center gap-3">
            {topNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link py-0 ${isActive(link.href) ? "fw-semibold" : ""}`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/search" className="nav-link py-0" aria-label={t.nav.search}>
              <i className="bi bi-search"></i>
            </Link>
            <LanguageSwitcher lang={lang} />
          </nav>
        </div>
      </div>

      {/* Main nav — desktop */}
      <div className="portal-navbar-main d-none d-lg-block">
        <div className="container">
          <nav className="d-flex flex-wrap gap-4 py-1">
            {mainNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link px-0 ${isActive(link.href) ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="portal-navbar-mobile d-lg-none">
          <div className="container py-2">
            <nav className="d-flex flex-column">
              {[...mainNavLinks, ...topNavLinks].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link py-2 border-bottom ${isActive(link.href) ? "fw-semibold" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/search"
                className="nav-link py-2 border-bottom"
                onClick={() => setOpen(false)}
              >
                <i className="bi bi-search me-2"></i>{t.nav.search}
              </Link>
              <div className="py-2">
                <LanguageSwitcher lang={lang} />
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
