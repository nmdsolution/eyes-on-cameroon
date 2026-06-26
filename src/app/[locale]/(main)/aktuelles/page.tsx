import { getTranslations, getLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchDevToArticles, type DevToArticle } from "@/lib/devto-api";
import PlaceholderImage from "@/components/PlaceholderImage";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "news" });
  return { title: t("title") };
}

type Article = {
  id: string;
  title: string;
  excerpt: string;
  published_at: string;
  slug: string;
  cover_url?: string;
  external_url?: string;
  source?: "devto" | "db";
};

export default async function NewsPage() {
  const [t, locale] = await Promise.all([getTranslations("news"), getLocale()]);

  let articles: Article[] = [];

  // 1. Try Dev.to
  try {
    const devtoArticles = await fetchDevToArticles(12);
    if (devtoArticles.length > 0) {
      articles = devtoArticles;
    }
  } catch {
    // Dev.to unavailable
  }

  // 2. Fall back to Supabase if Dev.to returned nothing
  if (articles.length === 0) {
    try {
      const supabase = await createClient();
      const { data: localeData } = await supabase
        .from("articles")
        .select("id, title, excerpt, published_at, slug, cover_url")
        .eq("locale", locale)
        .order("published_at", { ascending: false });

      if (localeData && localeData.length > 0) {
        articles = localeData.map((a) => ({ ...a, source: "db" as const }));
      } else {
        const { data: allData } = await supabase
          .from("articles")
          .select("id, title, excerpt, published_at, slug, cover_url")
          .order("published_at", { ascending: false });
        articles = (allData ?? []).map((a) => ({ ...a, source: "db" as const }));
      }
    } catch {
      // Supabase not configured
    }
  }

  // 3. Fall back to placeholders
  const displayArticles: Article[] =
    articles.length > 0
      ? articles
      : [
          { id: "1", title: t("placeholder_1_title"), excerpt: t("placeholder_1_excerpt"), published_at: "2024-11-15", slug: "jahrestreffen-2024" },
          { id: "2", title: t("placeholder_2_title"), excerpt: t("placeholder_2_excerpt"), published_at: "2024-09-01", slug: "schulprojekt-2024" },
          { id: "3", title: t("placeholder_3_title"), excerpt: t("placeholder_3_excerpt"), published_at: "2024-07-20", slug: "kulturabend-2024" },
          { id: "4", title: t("placeholder_4_title"), excerpt: t("placeholder_4_excerpt"), published_at: "2024-05-10", slug: "spendenaktion-2024" },
        ];

  return (
    <>
      <section className="relative bg-green-900 text-white overflow-hidden py-6 md:py-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-green-700/40 via-transparent to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-block w-10 h-1 rounded-full bg-yellow-400" />
            <span className="text-yellow-300 font-semibold text-sm uppercase tracking-widest">{t("title")}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">{t("subtitle")}</h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex h-1.5">
          <div className="flex-1 bg-green-500" /><div className="flex-1 bg-red-600" /><div className="flex-1 bg-yellow-400" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {displayArticles[0]?.source === "devto" && (
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-xs font-semibold">
              <svg viewBox="0 0 448 512" className="w-3 h-3 fill-white" aria-hidden="true">
                <path d="M120.12 208.29c-3.88-2.9-7.77-4.35-11.65-4.35H91.03v104.47h17.45c3.88 0 7.77-1.45 11.65-4.35 3.88-2.9 5.82-7.25 5.82-13.06v-69.65c-.01-5.8-1.96-10.16-5.83-13.06zM404.1 32H43.9C19.7 32 .06 51.59 0 75.8v360.4C.06 460.41 19.7 480 43.9 480h360.2c24.21 0 43.84-19.59 43.9-43.8V75.8c-.06-24.21-19.7-43.8-43.9-43.8zM154.2 291.19c0 18.81-11.61 47.31-48.36 47.25h-46.4V172.98h47.38c35.44 0 47.36 28.46 47.36 47.28l.02 70.93zm100.68-88.66H201.6v38.42h32.57v29.57H201.6v38.41h53.29v29.57h-62.18c-11.16.29-20.44-8.53-20.72-19.69V193.7c-.27-11.15 8.56-20.41 19.71-20.69h63.19l-.01 29.52zm103.64 115.29c-13.2 30.75-36.85 24.63-47.44 0l-38.53-144.8h32.57l29.71 113.72 29.57-113.72h32.58l-38.46 144.8z"/>
              </svg>
              Dev.to
            </span>
            <span className="text-sm text-gray-500">Articles publics Dev.to — #cameroon #africa #culture</span>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayArticles.map((article) => {
            const isExternal = article.source === "devto" && !!article.external_url;
            const formattedDate = article.published_at
              ? new Date(article.published_at).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })
              : article.published_at;

            const cardContent = (
              <>
                {article.cover_url ? (
                  <div className="relative h-44">
                    <Image
                      src={article.cover_url}
                      alt={article.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-top"
                    />
                  </div>
                ) : (
                  <PlaceholderImage className="h-44" label={article.title} />
                )}
                <div className="p-6">
                  {isExternal && (
                    <span className="inline-flex items-center gap-1 text-xs text-gray-400 mb-2">
                      <svg viewBox="0 0 448 512" className="w-2.5 h-2.5 fill-current" aria-hidden="true">
                        <path d="M120.12 208.29c-3.88-2.9-7.77-4.35-11.65-4.35H91.03v104.47h17.45c3.88 0 7.77-1.45 11.65-4.35 3.88-2.9 5.82-7.25 5.82-13.06v-69.65c-.01-5.8-1.96-10.16-5.83-13.06zM404.1 32H43.9C19.7 32 .06 51.59 0 75.8v360.4C.06 460.41 19.7 480 43.9 480h360.2c24.21 0 43.84-19.59 43.9-43.8V75.8c-.06-24.21-19.7-43.8-43.9-43.8zM154.2 291.19c0 18.81-11.61 47.31-48.36 47.25h-46.4V172.98h47.38c35.44 0 47.36 28.46 47.36 47.28l.02 70.93zm100.68-88.66H201.6v38.42h32.57v29.57H201.6v38.41h53.29v29.57h-62.18c-11.16.29-20.44-8.53-20.72-19.69V193.7c-.27-11.15 8.56-20.41 19.71-20.69h63.19l-.01 29.52zm103.64 115.29c-13.2 30.75-36.85 24.63-47.44 0l-38.53-144.8h32.57l29.71 113.72 29.57-113.72h32.58l-38.46 144.8z"/>
                      </svg>
                      dev.to
                    </span>
                  )}
                  <p className="text-xs text-gray-400 mb-1">{formattedDate}{(article as DevToArticle).author ? <> · <span className="font-medium">{(article as DevToArticle).author}</span></> : null}</p>
                  <h2 className="font-bold text-gray-900 mb-2 text-lg leading-snug">{article.title}</h2>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-green-700 text-sm font-semibold hover:underline group-hover:gap-2 transition-all">
                    {t("read_more")} {isExternal ? <ExternalLink size={13} /> : "→"}
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
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow block"
              >
                {cardContent}
              </a>
            ) : (
              <Link
                key={article.id}
                href={`/aktuelles/${article.slug}`}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow block"
              >
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
