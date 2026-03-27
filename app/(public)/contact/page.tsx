import PageHeader from "@/components/layout/PageHeader";
import { prisma } from "@/lib/db";

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

  return (
    <>
      <PageHeader
        title="Contacto"
        breadcrumbs={[{ label: "Contacto" }]}
      />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h4 className="text-portal-primary mb-3">Contáctanos</h4>
                <p className="text-muted">
                  Para consultas, colaboraciones o más información sobre el portal,
                  no dudes en escribirnos.
                </p>
                {contactEmail && (
                  <a
                    href={`mailto:${contactEmail}`}
                    className="btn btn-blue btn-lg mt-2"
                  >
                    <i className="bi bi-envelope me-2"></i>
                    {contactEmail}
                  </a>
                )}
                {!contactEmail && (
                  <p className="text-muted small">
                    Email de contacto no configurado.{" "}
                    <a href="/admin/settings">Configurar en Admin</a>
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
