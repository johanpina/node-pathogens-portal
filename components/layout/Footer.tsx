import Link from "next/link";
import { prisma } from "@/lib/db";
import { getLang } from "@/lib/getLang";
import { getT } from "@/lib/i18n";

async function getSettings() {
  try {
    const settings = await prisma.setting.findMany({
      where: { key: { in: ["site_title", "contact_email", "twitter_url", "github_url"] } },
    });
    return Object.fromEntries(settings.map((s) => [s.key, s.value]));
  } catch {
    return {};
  }
}

export default async function Footer() {
  const [settings, lang] = await Promise.all([getSettings(), getLang()]);
  const t = getT(lang);

  return (
    <footer className="portal-footer">
      {/* Logos de instituciones */}
      <div className="footer-logos">
        <div className="container d-flex justify-content-center align-items-center gap-5 flex-wrap">
          <img
            src="/images/logos/logo_uga.png"
            alt="UGA – Unidad de Genómica Avanzada"
            style={{ height: 60, width: "auto" }}
          />
          <img
            src="/images/logos/logo_accdis.png"
            alt="ACCDiS – Advanced Center for Chronic Diseases"
            style={{ height: 60, width: "auto" }}
          />
          <img
            src="/images/logos/logo_chair.png"
            alt="CHAIR – Center for HIV/AIDS Integral Research"
            style={{ height: 60, width: "auto" }}
          />
          <img
            src="/images/logos/logo_facicqf.png"
            alt="Facultad de Ciencias Químicas y Farmacéuticas – Universidad de Chile"
            style={{ height: 60, width: "auto" }}
          />
        </div>
      </div>

      {/* Links */}
      <div className="footer-links">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mb-3">
              <p className="footer-section-label">{t.footer.sectionAbout}</p>
              <Link href="/about">{t.footer.aboutPortal}</Link>
              <br />
              <Link href="/news">{t.footer.portalNews}</Link>
              <br />
              <Link href="/contact">{t.footer.contactFeedback}</Link>
            </div>
            <div className="col-md-6 mb-3 text-md-end">
              <p className="footer-section-label">{t.footer.sectionConnect}</p>
              <div className="d-flex gap-3 justify-content-md-end">
                {settings.twitter_url && (
                  <a
                    href={settings.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter/X"
                  >
                    <i className="bi bi-twitter-x fs-4"></i>
                  </a>
                )}
                {settings.contact_email && (
                  <a href={`mailto:${settings.contact_email}`} aria-label="Email">
                    <i className="bi bi-envelope fs-4"></i>
                  </a>
                )}
                {settings.github_url && (
                  <a
                    href={settings.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  >
                    <i className="bi bi-github fs-4"></i>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legal */}
      <div className="footer-legal">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-9">
              <p className="mb-1">{t.footer.legal1}</p>
              <p className="mb-0">
                {t.footer.legal2}{" "}
                <a href="https://creativecommons.org/licenses/by/4.0/">CC-BY 4.0</a>.{" "}
                {t.footer.legal3}{" "}
                <a href="https://opensource.org/licenses/MIT">MIT</a>.{" "}
                <Link href="/admin" className="ms-2">
                  Admin
                </Link>
              </p>
            </div>
            <div className="col-md-3 text-md-end mt-2 mt-md-0">
              <img src="/img/pdn_logo.png" alt="PDN" style={{ height: 50, width: "auto" }} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
