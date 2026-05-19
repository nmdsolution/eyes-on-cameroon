import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Calendar, Users, Globe2, Play } from "lucide-react";
import PlaceholderImage from "@/components/PlaceholderImage";
import Image from "next/image";
import VideoButton from "@/components/VideoButton";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  return { title: t("title"), description: t("subtitle") };
}

function HeroSection() {
  const t = useTranslations("hero");
  // Set to false to use fallback gradient instead of image
  const hasHeroImage = true;

  return (
    <section className="relative text-white overflow-hidden min-h-[500px] md:min-h-[600px]">
      {/* Background */}
      <div className="absolute inset-0">
        {hasHeroImage ? (
          <>
            <Image
              src="/images/hero-cameroon.avif"
              alt="Cameroon landscape"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-950/90 via-green-900/80 to-green-800/70" />
          </>
        ) : (
          /* Fallback: Cameroon flag themed gradient */
          <div className="absolute inset-0 bg-gradient-to-br from-green-800 via-green-700 to-green-900">
            {/* Subtle flag stripe pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="h-full w-full flex flex-col">
                <div className="flex-1 bg-green-400" />
                <div className="flex-1 bg-red-500" />
                <div className="flex-1 bg-yellow-400" />
              </div>
            </div>
            {/* Star watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <svg viewBox="0 0 24 24" className="w-96 h-96 fill-yellow-300">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
            </div>
          </div>
        )}
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            {t("title")}
          </h1>
          <p className="text-lg md:text-xl text-green-100 mb-8 max-w-xl">
            {t("subtitle")}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/aktuelles"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-800 font-semibold rounded-full hover:bg-green-50 transition-colors"
            >
              {t("cta_news")} <ArrowRight size={18} />
            </Link>
            <Link
              href="/wer-sind-wir"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
            >
              {t("cta_about")}
            </Link>
            <VideoButton />
          </div>
        </div>
      </div>
      {/* Cameroon flag stripe accent */}
      <div className="absolute bottom-0 left-0 right-0 flex h-2">
        <div className="flex-1 bg-green-500" />
        <div className="flex-1 bg-red-600" />
        <div className="flex-1 bg-yellow-400" />
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { icon: <Globe2 size={28} />, value: "2", label: "Länder" },
    { icon: <Users size={28} />, value: "100+", label: "Mitglieder" },
    { icon: <Calendar size={28} />, value: "20+", label: "Jahre" },
  ];
  return (
    <section className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-3 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-2">
              <div className="text-green-700">{s.icon}</div>
              <div className="text-3xl font-bold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  const t = useTranslations("about");
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("title")}</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">{t("description")}</p>
            <h3 className="text-xl font-semibold text-green-700 mb-2">{t("mission_title")}</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{t("mission_text")}</p>
            <Link
              href="/wer-sind-wir"
              className="inline-flex items-center gap-2 text-green-700 font-semibold hover:underline"
            >
              {t("read_more")} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="relative rounded-2xl h-64 md:h-80 overflow-hidden shadow-lg">
            <Image
              src="/images/apropo.png"
              alt="About Eyes on Cameroon"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

async function NewsSection() {
  const t = await getTranslations("news");

  // Fetch articles from Supabase API
  let articles: Array<{ id: string; title: string; slug: string; published_at: string; excerpt?: string; cover_url?: string }> = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("articles")
      .select("id, title, slug, published_at, excerpt, cover_url")
      .order("published_at", { ascending: false })
      .limit(3);
    articles = data ?? [];
  } catch {
    console.error("Failed to fetch articles");
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{t("title")}</h2>
            <p className="text-gray-500 mt-1">{t("subtitle")}</p>
          </div>
          <Link href="/aktuelles" className="text-green-700 font-semibold hover:underline hidden sm:flex items-center gap-1">
            {t("all_articles")} <ArrowRight size={16} />
          </Link>
        </div>
        {articles.length === 0 ? (
          <p className="text-gray-500 text-center py-8">{t("no_articles")}</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article key={article.id} className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                {article.cover_url ? (
                  <div className="relative h-40">
                    <Image src={article.cover_url} alt={article.title} fill className="object-cover" />
                  </div>
                ) : (
                  <PlaceholderImage className="h-40" label={article.title} />
                )}
                <div className="p-5">
                  <p className="text-xs text-gray-400 mb-2">{article.published_at}</p>
                  <h3 className="font-bold text-gray-900 mb-2">{article.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{article.excerpt || ""}</p>
                  <Link href={`/aktuelles/${article.slug || article.id}`} className="text-green-700 text-sm font-semibold hover:underline">
                    {t("read_more")} →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

async function EventsSection() {
  const t = await getTranslations("events");

  // Fetch events from Supabase API
  let events: Array<{ id: string; title: string; date: string; location: string; description?: string; image_url?: string }> = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("events")
      .select("id, title, date, location, description, image_url")
      .order("date", { ascending: true })
      .limit(2);
    events = data ?? [];
  } catch {
    console.error("Failed to fetch events");
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{t("title")}</h2>
            <p className="text-gray-500 mt-1">{t("subtitle")}</p>
          </div>
          <Link href="/veranstaltungen" className="text-green-700 font-semibold hover:underline hidden sm:flex items-center gap-1">
            {t("all_events")} <ArrowRight size={16} />
          </Link>
        </div>
        {events.length === 0 ? (
          <p className="text-gray-500 text-center py-8">{t("no_events")}</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                {event.image_url ? (
                  <div className="relative h-40">
                    <Image src={event.image_url} alt={event.title} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="h-40 bg-green-100 flex items-center justify-center">
                    <Calendar size={40} className="text-green-300" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                    <Calendar size={14} />
                    <span>{event.date}</span>
                    <span>·</span>
                    <span>{event.location}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{event.title}</h3>
                  {event.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function DonateSection() {
  const t = useTranslations("donate");
  return (
    <section className="py-16 bg-green-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">{t("title")}</h2>
        <p className="text-green-100 mb-8 max-w-xl mx-auto">{t("description")}</p>
        <Link
          href="/spenden"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-800 font-bold rounded-full hover:bg-green-50 transition-colors text-lg"
        >
          {t("button")} <ArrowRight size={20} />
        </Link>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <NewsSection />
      <EventsSection />
      <DonateSection />
    </>
  );
}
