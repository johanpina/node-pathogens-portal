import PageHeader from "@/components/layout/PageHeader";
import ContactForm from "@/components/public/ContactForm";
import { getLang } from "@/lib/getLang";
import { getT } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export const metadata = { title: "Contacto — Portal de Patógenos" };

// Messages from the contact form are routed to the bioinformatics team.
const CONTACT_TO = "bioinformatica@ciq.uchile.cl";

export default async function ContactPage() {
  const lang = await getLang();
  const t = getT(lang);

  return (
    <>
      <PageHeader title={t.contact.title} breadcrumbs={[{ label: t.contact.title }]} />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">
                <h4 className="text-portal-primary mb-2">{t.contact.heading}</h4>
                <p className="text-muted">{t.contact.intro}</p>

                <ContactForm to={CONTACT_TO} lang={lang} />

                <hr className="my-4" />
                <p className="text-muted small mb-0">
                  {t.contact.orWriteTo}{" "}
                  <a href={`mailto:${CONTACT_TO}`}>{CONTACT_TO}</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
