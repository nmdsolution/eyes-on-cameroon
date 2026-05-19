import { createAdminClient } from "@/lib/supabase/admin";
import PartnersClient from "./PartnersClient";

export const metadata = { title: "Partners — Admin" };

export default async function PartnersPage() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("partners")
    .select("*")
    .order("order", { ascending: true });

  return <PartnersClient initialData={data ?? []} />;
}
