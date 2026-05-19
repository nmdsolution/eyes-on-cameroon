import { createAdminClient } from "@/lib/supabase/admin";
import EventsClient from "./EventsClient";

export const metadata = { title: "Events — Admin" };

export default async function EventsPage() {
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: false });

  return <EventsClient initialData={data ?? []} />;
}
