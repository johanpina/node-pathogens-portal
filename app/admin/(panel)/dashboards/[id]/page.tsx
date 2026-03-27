import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import DashboardForm from "../DashboardForm";

export const dynamic = "force-dynamic";

export default async function EditDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dashboard = await prisma.dashboard.findUnique({
    where: { id },
    include: { topics: { include: { topic: true } } },
  });
  if (!dashboard) notFound();

  return (
    <div>
      <h2 className="fw-bold mb-4">Editar Dashboard</h2>
      <DashboardForm initialData={dashboard} />
    </div>
  );
}
