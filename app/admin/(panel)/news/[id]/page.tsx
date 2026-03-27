import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import NewsForm from "../NewsForm";

export const dynamic = "force-dynamic";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const news = await prisma.news.findUnique({ where: { id } });
  if (!news) notFound();

  return (
    <div>
      <h2 className="fw-bold mb-4">Editar Noticia</h2>
      <NewsForm initialData={news} />
    </div>
  );
}
