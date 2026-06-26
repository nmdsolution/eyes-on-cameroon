import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Music, Shirt, BookOpen, UtensilsCrossed, Theater, Heart, ExternalLink } from "lucide-react";
import PlaceholderImage from "@/components/PlaceholderImage";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import PromoPopup from "@/components/PromoPopup";
import { createClient } from "@/lib/supabase/server";
import { fetchDevToArticles } from "@/lib/devto-api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  return { title: t("title"), description: t("subtitle") };
}

// ─── EVENTS HERO ──────────────────────────────────────────────────────────────
async function EventsSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "events" });

  let events: Array<{
    id: string;
    title: string;
    date: string;
    location: string;
    description?: string;
    image_url?: string;
    featured?: boolean;
  }> = [];

  try {
    const supabase = await createClient();
    const { data: localeData } = await supabase
      .from("events")
      .select("id, title, date, location, description, image_url, featured")
      .eq("locale", locale)
      .order("sort_order", { ascending: true })
      .order("featured", { ascending: false })
      .order("date", { ascending: true })
      .limit(4);

    if (localeData && localeData.length > 0) {
      events = localeData;
    } else {
      const { data: allData } = await supabase
        .from("events")
        .select("id, title, date, location, description, image_url, featured")
        .order("featured", { ascending: false })
        .order("date", { ascending: true })
        .limit(4);
      events = allData ?? [];
    }
  } catch {
    console.error("Failed to fetch events");
  }

  const [featured, ...secondary] = events;

  const sidebarGradients = [
    "radial-gradient(ellipse at 40% 50%, rgba(150,90,20,0.35) 0%, transparent 60%), linear-gradient(145deg, #4A6B3A 0%, #253A1E 100%)",
    "radial-gradient(ellipse at 60% 30%, rgba(30,70,90,0.4) 0%, transparent 60%), linear-gradient(145deg, #2A4A5A 0%, #132230 100%)",
    "radial-gradient(ellipse at 50% 60%, rgba(120,40,40,0.3) 0%, transparent 60%), linear-gradient(145deg, #5A3030 0%, #2A1515 100%)",
  ];

  return (
    <section className="bg-[#1C1C1E] px-4 sm:px-8 lg:px-20 pt-8 sm:pt-12 lg:pt-20 pb-10 sm:pb-14 lg:pb-[88px]">

      {events.length === 0 ? (
        <p className="text-[#8A8275] text-center py-8">{t("no_events")}</p>
      ) : (
        <div className={`grid gap-[3px] ${secondary.length > 0 ? "grid-cols-1 lg:grid-cols-[3fr_2fr]" : "grid-cols-1"}`}>
          {/* Featured event */}
          <Link
            href={`/veranstaltungen/${featured.id}`}
            className="flex flex-col bg-white/[0.03] border border-white/[0.09] overflow-hidden hover:border-white/20 transition-colors group"
          >
            <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[4/3] overflow-hidden flex-shrink-0 bg-[#111]">
              {featured.image_url ? (
                <>
                  <Image
                    src={featured.image_url}
                    alt={featured.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </>
              ) : (
                <>
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse at 70% 30%, rgba(210,140,45,0.35) 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(15,61,33,0.6) 0%, transparent 50%), linear-gradient(155deg, #3A7A55 0%, #1D4D35 35%, #0D2E1E 65%, #501E0A 100%)",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                </>
              )}
              <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-7 pb-4 sm:pb-6 flex items-end justify-between z-10">
                <span className="inline-flex items-center self-start bg-[#E8A900] text-[#1C1C1E] text-[9px] font-bold tracking-[0.1em] uppercase px-[11px] py-[5px]">
                  {t("featured")}
                </span>
                <div className="text-right">
                  <span className="font-serif text-[40px] sm:text-[58px] leading-none tracking-[-0.04em] text-white tabular-nums block">
                    {new Date(featured.date).getDate()}
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-white/55 block">
                    {new Date(featured.date).toLocaleDateString(locale, {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
            <div className="px-4 sm:px-7 py-5 sm:py-7 flex flex-col gap-2.5 flex-1">
              <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[#E8A900]">
                {featured.location}
              </p>
              <h3 className="font-serif text-[22px] sm:text-[28px] leading-[1.25] tracking-[-0.015em] text-white text-balance">
                {featured.title}
              </h3>
              {featured.description && (
                <p className="text-[13px] sm:text-[13.5px] leading-[1.65] text-[#8A8275] line-clamp-3">
                  {featured.description}
                </p>
              )}
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.08em] uppercase text-white border-b border-white/30 pb-[3px] self-start mt-1 group-hover:border-white transition-colors">
                {t("all_events")} →
              </span>
            </div>
          </Link>

          {/* Sidebar */}
          {secondary.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-[3px]">
              {secondary.map((event, i) => (
                <Link
                  key={event.id}
                  href={`/veranstaltungen/${event.id}`}
                  className="flex flex-col bg-white/[0.04] border border-white/[0.07] overflow-hidden hover:bg-white/[0.09] transition-colors"
                >
                  <div className="relative w-full h-28 sm:h-32 overflow-hidden">
                    {event.image_url ? (
                      <Image
                        src={event.image_url}
                        alt={event.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 40vw"
                        className="object-cover object-top"
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{ background: sidebarGradients[i % sidebarGradients.length] }}
                      />
                    )}
                  </div>
                  <div className="px-4 py-3 flex flex-col gap-1.5">
                    <p className="text-[10px] font-bold text-[#E8A900] tracking-[0.06em] tabular-nums">
                      {new Date(event.date).toLocaleDateString(locale, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      {" · "}
                      {event.location}
                    </p>
                    <h4 className="text-[13px] font-semibold text-white leading-[1.3] line-clamp-2">
                      {event.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────
function AboutSection() {
  const t = useTranslations("about");

  const activities = [
    { icon: Theater,         label: "Théâtre & Danse" },
    { icon: Music,           label: "Musique" },
    { icon: Shirt,           label: "Mode" },
    { icon: BookOpen,        label: "Littérature" },
    { icon: UtensilsCrossed, label: "Gastronomie" },
    { icon: Heart,           label: "Solidarité" },
  ];

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center gap-3 mb-10">
          <span className="inline-block w-10 h-1 rounded-full bg-green-600" />
          <span className="text-green-700 font-semibold text-sm uppercase tracking-widest">
            {t("title")}
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">

          <div className="flex flex-col gap-6">
            <p className="text-gray-600 text-lg leading-relaxed">{t("description")}</p>
            <p className="text-gray-500 leading-relaxed">{t("activities_text")}</p>

            <blockquote className="border-l-4 border-green-500 pl-5 py-1">
              <p className="text-green-900 font-medium italic leading-relaxed">
                &ldquo;Ensemble, nous construisons des ponts culturels entre l&apos;Allemagne et le Cameroun.&rdquo;
              </p>
            </blockquote>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-green-600 rounded-full inline-block" />
                {t("activities_title")}
              </h3>
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

            <div className="flex gap-6 py-4 border-y border-gray-100">
              {[
                { value: "2",    label: "Pays" },
                { value: "100+", label: "Membres" },
                { value: "20+",  label: "Ans" },
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

          <div className="relative">
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

// ─── CONTACT ──────────────────────────────────────────────────────────────────
function ContactSection() {
  return (
    <section className="py-16 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block w-10 h-1 rounded-full bg-green-600" />
              <span className="text-green-700 font-semibold text-sm uppercase tracking-widest">
                Contact
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nous contacter</h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              Vous avez une question, une suggestion ou souhaitez rejoindre notre association ?
              N&apos;hésitez pas à nous écrire, nous vous répondrons dans les meilleurs délais.
            </p>
            <div className="space-y-3 text-sm text-gray-600">
              <p><span className="font-semibold text-gray-800">Email :</span> contact@eyesoncameroon.de</p>
              <p><span className="font-semibold text-gray-800">Adresse :</span> Deutschland</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── NEWS ─────────────────────────────────────────────────────────────────────
type NewsArticle = {
  id: string;
  title: string;
  slug: string;
  published_at: string;
  excerpt?: string;
  cover_url?: string;
  external_url?: string;
  source?: "devto" | "db";
  author?: string;
};

async function NewsSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "news" });

  let articles: NewsArticle[] = [];

  try {
    const devto = await fetchDevToArticles(3);
    if (devto.length > 0) articles = devto;
  } catch { /* Dev.to unavailable */ }

  if (articles.length === 0) {
    try {
      const supabase = await createClient();
      const { data: localeData } = await supabase
        .from("articles")
        .select("id, title, slug, published_at, excerpt, cover_url")
        .eq("locale", locale)
        .order("published_at", { ascending: false })
        .limit(3);

      if (localeData && localeData.length > 0) {
        articles = localeData.map((a) => ({ ...a, source: "db" as const }));
      } else {
        const { data: allData } = await supabase
          .from("articles")
          .select("id, title, slug, published_at, excerpt, cover_url")
          .order("published_at", { ascending: false })
          .limit(3);
        articles = (allData ?? []).map((a) => ({ ...a, source: "db" as const }));
      }
    } catch { /* Supabase not configured */ }
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{t("title")}</h2>
            <p className="text-gray-500 mt-1">{t("subtitle")}</p>
          </div>
          <Link
            href="/aktuelles"
            className="text-green-700 font-semibold hover:underline hidden sm:flex items-center gap-1"
          >
            {t("all_articles")} <ArrowRight size={16} />
          </Link>
        </div>
        {articles.length === 0 ? (
          <p className="text-gray-500 text-center py-8">{t("no_articles")}</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => {
              const isExternal = article.source === "devto" && !!article.external_url;
              const cardInner = (
                <>
                  {article.cover_url ? (
                    <div className="relative h-40">
                      <Image
                        src={article.cover_url}
                        alt={article.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-top"
                      />
                    </div>
                  ) : (
                    <PlaceholderImage className="h-40" label={article.title} />
                  )}
                  <div className="p-5">
                    <p className="text-xs text-gray-400 mb-2">
                      {new Date(article.published_at).toLocaleDateString(locale, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      {article.author ? (
                        <> · <span className="font-medium">{article.author}</span></>
                      ) : null}
                    </p>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{article.excerpt || ""}</p>
                    <span className="inline-flex items-center gap-1 text-green-700 text-sm font-semibold hover:underline">
                      {t("read_more")} {isExternal ? <ExternalLink size={12} /> : "→"}
                    </span>
                  </div>
                </>
              );

              return isExternal ? (
                <a
                  key={article.id}
                  href={article.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-md transition-shadow block"
                >
                  {cardInner}
                </a>
              ) : (
                <Link
                  key={article.id}
                  href={`/aktuelles/${article.slug || article.id}`}
                  className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-md transition-shadow block"
                >
                  {cardInner}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── DONATE ───────────────────────────────────────────────────────────────────
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

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <PromoPopup />
      <EventsSection locale={locale} />
      <AboutSection />
      <ContactSection />
      <NewsSection locale={locale} />
      <DonateSection />
    </>
  );
}
