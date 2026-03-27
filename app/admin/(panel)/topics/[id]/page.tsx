import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import TopicForm from "../TopicForm";

export const dynamic = "force-dynamic";

export default async function EditTopicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const topic = await prisma.topic.findUnique({ where: { id } });
  if (!topic) notFound();

  return (
    <div>
      <h2 className="fw-bold mb-4">Editar Tema</h2>
      <TopicForm initialData={topic} />
    </div>
  );
}
