import { createAdminClient, getAdminSession } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import PubBannersClient from "./PubBannersClient";

export default async function PubBannersPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("pub_banners")
    .select("*")
    .order("sort_order", { ascending: true });

  return <PubBannersClient initialData={data ?? []} />;
}
