import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/supabase/admin";
import AdminSidebar from "./AdminSidebar";

export const metadata = {
  title: "Admin — Eyes on Cameroon",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar userEmail={session.user.email ?? ""} />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
