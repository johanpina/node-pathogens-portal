import AdminLayout from "@/components/admin/AdminLayout";
import { getAuthUser } from "@/lib/auth";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();

  return (
    <AdminLayout userName={user?.name}>
      {children}
    </AdminLayout>
  );
}
