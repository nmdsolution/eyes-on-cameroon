import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Calendar, Users, Globe2, Music, Shirt, BookOpen, UtensilsCrossed, Theater, Heart } from "lucide-react";
import PlaceholderImage from "@/components/PlaceholderImage";
import Image from "next/image";
import VideoButton from "@/components/VideoButton";
import BannerSlider from "@/components/BannerSlider";
import HeroImage from "@/components/HeroImage";
import PromoPopup from "@/components/PromoPopup";
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

type HeroMedia = {
  video_url: string | null;
  image_url: string | null;
  media_type: "video" | "image" | null;
};

function HeroSection({ heroMedia }: { heroMedia?: HeroMedia }) {
  const t = useTranslations("hero");

  return (
    <section className="group relative text-white overflow-hidden min-h-[500px] md:min-h-[600px]">
      <div className="absolute inset-0">
        <>
          <Image
            src="/images/hero-cameroon2.jpg"
            alt="Cameroon landscape"
            fill
            className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-950/90 via-green-900/80 to-green-800/70" />
        </>
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
            <VideoButton
              videoUrl={heroMedia?.video_url}
              imageUrl={heroMedia?.image_url}
              mediaType={heroMedia?.media_type}
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex h-2">
        <div className="flex-1 bg-green-500" />
        <div className="flex-1 bg-red-600" />
        <div className="flex-1 bg-yellow-400" />
      </div>
    </section>
  );
}

function StatsSection() {
  const t = useTranslations("home");
  const stats = [
    { icon: <Globe2 size={28} />, value: "2", label: t("stats_countries") },
    { icon: <Users size={28} />, value: "100+", label: t("stats_members") },
    { icon: <Calendar size={28} />, value: "20+", label: t("stats_years") },
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

  const activities = [
    { icon: Theater,        label: "Théâtre & Danse" },
    { icon: Music,          label: "Musique" },
    { icon: Shirt,          label: "Mode" },
    { icon: BookOpen,       label: "Littérature" },
    { icon: UtensilsCrossed,label: "Gastronomie" },
    { icon: Heart,          label: "Solidarité" },
  ];

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section label */}
        <div className="flex items-center gap-3 mb-10">
          <span className="inline-block w-10 h-1 rounded-full bg-green-600" />
          <span className="text-green-700 font-semibold text-sm uppercase tracking-widest">
            {t("title")}
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left — text + activities */}
          <div className="flex flex-col gap-6">

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed">
              {t("description")}
            </p>

            {/* Activities text */}
            <p className="text-gray-500 leading-relaxed">
              {t("activities_text")}
            </p>

            {/* Highlight quote */}
            <blockquote className="border-l-4 border-green-500 pl-5 py-1">
              <p className="text-green-900 font-medium italic leading-relaxed">
                "Ensemble, nous construisons des ponts culturels entre l'Allemagne et le Cameroun."
              </p>
            </blockquote>

            {/* Activities heading */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-green-600 rounded-full inline-block" />
                {t("activities_title")}
              </h3>

              {/* Activity chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {activities.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2.5 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5 text-sm font-medium text-green-800"
                  >
                    <Icon size={16} className="text-green-600 shrink-0" />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Mini stats row */}
            <div className="flex gap-6 py-4 border-y border-gray-100">
              {[
                { value: "2", label: "Pays" },
                { value: "100+", label: "Membres" },
                { value: "20+", label: "Ans" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-bold text-green-700">{value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            <Link
              href="/wer-sind-wir"
              className="self-start inline-flex items-center gap-2 px-6 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-full transition-colors"
            >
              {t("read_more")} <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right — image with decorative frame */}
          <div className="relative">
            {/* Decorative background square */}
            <div className="absolute -top-4 -right-4 w-full h-full rounded-2xl bg-green-100 -z-10" />
            <div className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5">
              <Image
                src="/images/apropo.jpg"
                alt="About Eyes on Cameroon"
                width={0}
                height={0}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="w-full h-auto"
              />
            </div>
            {/* Cameroon flag colors bar */}
            <div className="flex h-1.5 rounded-full overflow-hidden mt-4">
              <div className="flex-1 bg-green-500" />
              <div className="flex-1 bg-red-600" />
              <div className="flex-1 bg-yellow-400" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

async function NewsSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "news" });

  let articles: Array<{ id: string; title: string; slug: string; published_at: string; excerpt?: string; cover_url?: string }> = [];
  try {
    const supabase = await createClient();
    const { data: localeData } = await supabase
      .from("articles")
      .select("id, title, slug, published_at, excerpt, cover_url")
      .eq("locale", locale)
      .order("published_at", { ascending: false })
      .limit(3);

    if (localeData && localeData.length > 0) {
      articles = localeData;
    } else {
      const { data: allData } = await supabase
        .from("articles")
        .select("id, title, slug, published_at, excerpt, cover_url")
        .order("published_at", { ascending: false })
        .limit(3);
      articles = allData ?? [];
    }
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
                    <Image src={article.cover_url} alt={article.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover object-top" />
                  </div>
                ) : (
                  <PlaceholderImage className="h-40" label={article.title} />
                )}
                <div className="p-5">
                  <p className="text-xs text-gray-400 mb-2">
                    {new Date(article.published_at).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })}
                  </p>
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

async function BannersSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "events" });

  let banners: Array<{ id: string; title: string | null; media_url: string; media_type: "image" | "video"; link_url: string | null }> = [];
  try {
    const supabase = await createClient();
    const { data: localeData } = await supabase
      .from("pub_banners")
      .select("id, title, media_url, media_type, link_url")
      .eq("active", true)
      .eq("locale", locale)
      .order("sort_order", { ascending: true });

    if (localeData && localeData.length > 0) {
      banners = localeData;
    } else {
      const { data: allData } = await supabase
        .from("pub_banners")
        .select("id, title, media_url, media_type, link_url")
        .eq("active", true)
        .order("sort_order", { ascending: true });
      banners = allData ?? [];
    }
  } catch {
    /* table may not exist yet */
  }

  if (banners.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/veranstaltungen" className="text-xs font-semibold uppercase tracking-widest text-green-700 mb-4 hover:underline block">
          {t("featured")}
        </Link>
        <BannerSlider banners={banners} />
      </div>
    </section>
  );
}

async function EventsSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "events" });

  let events: Array<{ id: string; title: string; date: string; location: string; description?: string; image_url?: string }> = [];
  try {
    const supabase = await createClient();
    const { data: localeData } = await supabase
      .from("events")
      .select("id, title, date, location, description, image_url")
      .eq("locale", locale)
      .order("date", { ascending: true })
      .limit(2);

    if (localeData && localeData.length > 0) {
      events = localeData;
    } else {
      // Fallback: show all events if none exist for this locale yet
      const { data: allData } = await supabase
        .from("events")
        .select("id, title, date, location, description, image_url")
        .order("date", { ascending: true })
        .limit(2);
      events = allData ?? [];
    }
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
              <Link key={event.id} href={`/veranstaltungen/${event.id}`} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow block">
                {event.image_url ? (
                  <div className="relative h-40">
                    <Image src={event.image_url} alt={event.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover object-top" />
                  </div>
                ) : (
                  <div className="h-40 bg-green-100 flex items-center justify-center">
                    <Calendar size={40} className="text-green-300" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                    <Calendar size={14} />
                    <span>{new Date(event.date).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })}</span>
                    <span>·</span>
                    <span>{event.location}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{event.title}</h3>
                  {event.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                  )}
                </div>
              </Link>
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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let heroMedia: HeroMedia | undefined;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("hero_settings")
      .select("video_url, image_url, media_type")
      .single();
    if (data) heroMedia = data as HeroMedia;
  } catch {
    // Table may not exist yet
  }

  return (
    <>
      <PromoPopup />
      <HeroSection heroMedia={heroMedia} />
      <AboutSection />
      <EventsSection locale={locale} />
      <BannersSection locale={locale} />
      <NewsSection locale={locale} />
      <DonateSection />
    </>
  );
}
