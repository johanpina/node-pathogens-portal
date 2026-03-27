import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import HighlightForm from "../HighlightForm";

export const dynamic = "force-dynamic";

export default async function EditHighlightPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const highlight = await prisma.highlight.findUnique({
    where: { id },
    include: { topics: { include: { topic: true } } },
  });
  if (!highlight) notFound();

  return (
    <div>
      <h2 className="fw-bold mb-4">Editar Destacado</h2>
      <HighlightForm initialData={highlight} />
    </div>
  );
}
