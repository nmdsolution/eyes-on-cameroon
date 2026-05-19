import { createAdminClient } from "@/lib/supabase/admin";
import ArticlesClient from "./ArticlesClient";

export const metadata = { title: "Articles — Admin" };

export default async function ArticlesPage() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  return <ArticlesClient initialData={data ?? []} />;
}
