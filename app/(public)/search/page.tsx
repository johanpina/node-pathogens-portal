import PageHeader from "@/components/layout/PageHeader";
import SearchBox from "@/components/public/SearchBox";

export const metadata = { title: "Búsqueda — Portal de Patógenos" };

export default function SearchPage() {
  return (
    <>
      <PageHeader
        title="Búsqueda"
        breadcrumbs={[{ label: "Búsqueda" }]}
      />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <SearchBox />
          </div>
        </div>
      </div>
    </>
  );
}
