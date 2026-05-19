import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/supabase/admin";
import LoginForm from "./LoginForm";

export const metadata = { title: "Admin Login — Eyes on Cameroon" };

export default async function LoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-sm text-gray-500 mt-1">Eyes on Cameroon</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
