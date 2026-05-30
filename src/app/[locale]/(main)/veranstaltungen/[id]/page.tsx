import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PlaceholderImage from "@/components/PlaceholderImage";
import Image from "next/image";

export default async function EventPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("common");

  let event: { 
    title: string; 
    description: string; 
    date: string; 
    end_date?: string;
    location: string; 
    image_url?: string 
  } | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("events")
      .select("title, description, date, end_date, location, image_url")
      .eq("id", id)
      .single();
    event = data;
  } catch {
    // Supabase not configured yet
  }

  if (!event) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {event.image_url ? (
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
          <Image src={event.image_url} alt={event.title} fill className="object-cover" />
        </div>
      ) : (
        <PlaceholderImage className="h-64 md:h-80 rounded-2xl mb-8" label={event.title} />
      )}
      
      <h1 className="text-4xl font-bold text-gray-900 mb-6">{event.title}</h1>
      
      <div className="flex flex-wrap gap-6 mb-8 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar size={18} className="text-green-700" />
          <span>
            {formatDate(event.date)}
            {event.end_date && ` - ${formatDate(event.end_date)}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-green-700" />
          <span>{event.location}</span>
        </div>
      </div>
      
      <div className="prose prose-green max-w-none text-gray-700 leading-relaxed">
        <p>{event.description}</p>
      </div>
    </div>
  );
}
