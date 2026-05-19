import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import { Calendar, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PlaceholderImage from "@/components/PlaceholderImage";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "events" });
  return { title: t("title") };
}

export default async function EventsPage() {
  const t = await getTranslations("events");

  // Fetch events from Supabase API
  let events: Array<{ id: string; title: string; date: string; location: string; description: string; image_url?: string }> = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("events")
      .select("id, title, date, location, description, image_url")
      .order("date", { ascending: true });
    events = data ?? [];
  } catch {
    console.error("Failed to fetch events");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <p className="text-gray-500 mb-10">{t("subtitle")}</p>

      {events.length === 0 ? (
        <p className="text-gray-500 text-center py-16">{t("no_events")}</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
              {event.image_url ? (
                <div className="relative h-48">
                  <Image src={event.image_url} alt={event.title} fill className="object-cover" />
                </div>
              ) : (
                <PlaceholderImage className="h-48" label={event.title} />
              )}
              <div className="p-6 flex gap-4 items-start">
                <div className="bg-green-100 rounded-xl p-3 flex flex-col items-center min-w-[60px]">
                  <span className="text-xs text-green-700 font-semibold">
                    {new Date(event.date).toLocaleDateString("de-DE", { month: "short" }).toUpperCase()}
                  </span>
                  <span className="text-xl font-bold text-green-800">
                    {new Date(event.date).getDate()}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-gray-900 text-lg mb-1">{event.title}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <MapPin size={14} /> {event.location}
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3">{event.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
