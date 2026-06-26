import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PlaceholderImage from "@/components/PlaceholderImage";
import Image from "next/image";
import FeaturedEventsSlider from "@/components/FeaturedEventsSlider";
import AdBanner from "@/components/AdBanner";

type EventRow = {
  title: string;
  description: string | null;
  date: string;
  end_date: string | null;
  location: string | null;
  image_url: string | null;
  content_img: string | null;
};

export default async function EventPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  let event: EventRow | null = null;

  let featuredEvents: Array<{
    id: string;
    title: string;
    date: string;
    location: string;
    image_url?: string;
  }> = [];

  try {
    const supabase = await createClient();

    // Always fetch by id — never filter by locale on detail page
    const { data: baseEvent } = await supabase
      .from("events")
      .select("title, description, date, end_date, location, image_url, content_img")
      .eq("id", id)
      .maybeSingle<EventRow>();

    if (baseEvent) {
      event = baseEvent;

      // If event has a slug, try to find the locale-specific translation
      try {
        const { data: withSlug } = await supabase
          .from("events")
          .select("slug")
          .eq("id", id)
          .maybeSingle<{ slug: string | null }>();

        if (withSlug?.slug) {
          const { data: localeEvent } = await supabase
            .from("events")
            .select("title, description, date, end_date, location, image_url, content_img")
            .eq("slug", withSlug.slug)
            .eq("locale", locale)
            .maybeSingle<EventRow>();

          if (localeEvent) event = localeEvent;
        }
      } catch {
        // slug column not yet available — keep original event
      }
    }

    const { data: featuredRes } = await supabase
      .from("events")
      .select("id, title, date, location, image_url")
      .neq("id", id)
      .order("date", { ascending: true })
      .limit(6);

    featuredEvents = featuredRes ?? [];
  } catch {
    // Supabase not configured
  }

  if (!event) notFound();

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString(locale, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_260px] gap-8 items-start">
        {/* Left: Ad column */}
        <div className="hidden lg:block">
          <AdBanner />
        </div>

        {/* Center: Main event content */}
        <div>
          <Link
            href="/veranstaltungen"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-700 mb-8 transition-colors"
          >
            <ArrowLeft size={16} /> {t("back")}
          </Link>

          {event!.content_img ? (
            <Image
              src={event!.content_img}
              alt={event!.title}
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto rounded-2xl mb-8"
            />
          ) : (
            <PlaceholderImage className="h-64 md:h-80 rounded-2xl mb-8" label={event!.title} />
          )}

          <h1 className="text-4xl font-bold text-gray-900 mb-6">{event!.title}</h1>

          <div className="flex flex-wrap gap-6 mb-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-green-700" />
              <span>
                {formatDate(event!.date)}
                {event!.end_date && ` - ${formatDate(event!.end_date)}`}
              </span>
            </div>
            {event!.location && (
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-green-700" />
                <span>{event!.location}</span>
              </div>
            )}
          </div>

          {event!.description && (
            <div className="prose prose-green max-w-none text-gray-700 leading-relaxed">
              <p>{event!.description}</p>
            </div>
          )}
        </div>

        {/* Right: Featured events slider */}
        <div>
          <FeaturedEventsSlider events={featuredEvents} />
          <div className="mt-6 lg:hidden">
            <AdBanner />
          </div>
        </div>
      </div>
    </div>
  );
}
