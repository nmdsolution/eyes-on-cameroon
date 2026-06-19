import { getTranslations, getLocale } from "next-intl/server";
import type { Metadata } from "next";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PlaceholderImage from "@/components/PlaceholderImage";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

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
  const [t, locale] = await Promise.all([getTranslations("events"), getLocale()]);

  let events: Array<{ id: string; title: string; date: string; location: string; description: string; image_url?: string }> = [];
  try {
    const supabase = await createClient();
    const { data: localeData } = await supabase
      .from("events")
      .select("id, title, date, location, description, image_url")
      .eq("locale", locale)
      .order("date", { ascending: true });

    if (localeData && localeData.length > 0) {
      events = localeData;
    } else {
      const { data: allData } = await supabase
        .from("events")
        .select("id, title, date, location, description, image_url")
        .order("date", { ascending: true });
      events = allData ?? [];
    }
  } catch {
    console.error("Failed to fetch events");
  }

  const featured = events[0];
  const rest = events.slice(1);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative bg-green-900 text-white overflow-hidden py-6 md:py-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-green-700/40 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-block w-10 h-1 rounded-full bg-yellow-400" />
            <span className="text-yellow-300 font-semibold text-sm uppercase tracking-widest">
              {t("title")}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            {t("subtitle")}
          </h1>
          <p className="text-green-200 text-lg max-w-xl">
            {events.length > 0
              ? `${events.length} événement${events.length > 1 ? "s" : ""} à venir`
              : t("no_events")}
          </p>
        </div>
        {/* Cameroon flag bar */}
        <div className="absolute bottom-0 left-0 right-0 flex h-1.5">
          <div className="flex-1 bg-green-500" />
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-yellow-400" />
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {events.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
              <Calendar size={36} className="text-green-400" />
            </div>
            <p className="text-xl font-semibold text-gray-700">{t("no_events")}</p>
            <p className="text-gray-400 text-sm max-w-sm">
              Revenez bientôt pour découvrir les prochains événements organisés par notre association.
            </p>
          </div>
        ) : (
          <div className="space-y-10">

            {/* ── Featured card (first event) ── */}
            {featured && (
              <Link
                href={`/veranstaltungen/${featured.id}`}
                className="group block bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="grid lg:grid-cols-2 min-h-[340px]">
                  {/* Image */}
                  <div className="relative min-h-[240px] lg:min-h-full overflow-hidden">
                    {featured.image_url ? (
                      <Image
                        src={featured.image_url}
                        alt={featured.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <PlaceholderImage className="h-full" label={featured.title} />
                    )}
                    {/* Featured badge */}
                    <span className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                      À la une
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-8 lg:p-12 flex flex-col justify-between">
                    <div>
                      {/* Date pill */}
                      <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 text-sm font-semibold px-4 py-2 rounded-full mb-6">
                        <Calendar size={15} />
                        {new Date(featured.date).toLocaleDateString(locale, {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-green-700 transition-colors">
                        {featured.title}
                      </h2>
                      <p className="text-gray-500 leading-relaxed line-clamp-4 mb-6">
                        {featured.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <MapPin size={15} />
                        <span>{featured.location}</span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-green-700 font-semibold text-sm group-hover:gap-3 transition-all">
                        Voir l&apos;événement <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* ── Rest of events grid ── */}
            {rest.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((event) => (
                  <Link
                    key={event.id}
                    href={`/veranstaltungen/${event.id}`}
                    className="group block bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden">
                      {event.image_url ? (
                        <Image
                          src={event.image_url}
                          alt={event.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <PlaceholderImage className="h-full" label={event.title} />
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-5">
                      {/* Date badge */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-green-700 text-white rounded-xl px-3 py-2 text-center min-w-[52px]">
                          <span className="block text-[10px] font-bold uppercase leading-none mb-0.5">
                            {new Date(event.date).toLocaleDateString(locale, { month: "short" })}
                          </span>
                          <span className="block text-xl font-extrabold leading-none">
                            {new Date(event.date).getDate()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <MapPin size={12} />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-gray-900 text-base mb-2 group-hover:text-green-700 transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-3">
                        {event.description}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="px-5 pb-4">
                      <span className="text-green-700 text-xs font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        En savoir plus <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

          </div>
        )}
      </div>
    </>
  );
}
