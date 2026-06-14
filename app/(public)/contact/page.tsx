import PageHeader from "@/components/layout/PageHeader";
import { prisma } from "@/lib/db";
import { getLang } from "@/lib/getLang";
import { getT } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export const metadata = { title: "Contacto — Portal de Patógenos" };

export default async function ContactPage() {
  let contactEmail = "";
  try {
    const setting = await prisma.setting.findUnique({ where: { key: "contact_email" } });
    if (setting?.value) contactEmail = setting.value;
  } catch {
    // use default
  }
  const lang = await getLang();
  const t = getT(lang);

  return (
    <>
      <PageHeader title={t.contact.title} breadcrumbs={[{ label: t.contact.title }]} />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h4 className="text-portal-primary mb-3">{t.contact.heading}</h4>
                <p className="text-muted">{t.contact.intro}</p>
                {contactEmail ? (
                  <a href={`mailto:${contactEmail}`} className="btn btn-blue btn-lg mt-2">
                    <i className="bi bi-envelope me-2"></i>
                    {contactEmail}
                  </a>
                ) : (
                  <p className="text-muted small">
                    {t.contact.notConfigured}{" "}
                    <a href="/admin/settings">{t.contact.configure}</a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
