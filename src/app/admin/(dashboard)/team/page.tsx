import { createAdminClient } from "@/lib/supabase/admin";
import TeamClient from "./TeamClient";

export const metadata = { title: "Team — Admin" };

export default async function TeamPage() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("team_members")
    .select("*")
    .order("order", { ascending: true });

  return <TeamClient initialData={data ?? []} />;
}
