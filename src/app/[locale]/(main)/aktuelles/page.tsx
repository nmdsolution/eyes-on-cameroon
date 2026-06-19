import { getTranslations, getLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import PlaceholderImage from "@/components/PlaceholderImage";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "news" });
  return { title: t("title") };
}

export default async function NewsPage() {
  const [t, locale] = await Promise.all([getTranslations("news"), getLocale()]);

  let articles: Array<{ id: string; title: string; excerpt: string; published_at: string; slug: string; cover_url?: string }> = [];
  try {
    const supabase = await createClient();
    const { data: localeData } = await supabase
      .from("articles")
      .select("id, title, excerpt, published_at, slug, cover_url")
      .eq("locale", locale)
      .order("published_at", { ascending: false });

    if (localeData && localeData.length > 0) {
      articles = localeData;
    } else {
      const { data: allData } = await supabase
        .from("articles")
        .select("id, title, excerpt, published_at, slug, cover_url")
        .order("published_at", { ascending: false });
      articles = allData ?? [];
    }
  } catch {
    // Supabase not configured yet — show placeholder
  }

  const placeholderArticles = articles.length > 0 ? articles : [
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
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {placeholderArticles.map((article) => (
          <article key={article.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
            {article.cover_url ? (
              <div className="relative h-44">
                <Image src={article.cover_url} alt={article.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover object-top" />
              </div>
            ) : (
              <PlaceholderImage className="h-44" label={article.title} />
            )}
            <div className="p-6">
              <p className="text-xs text-gray-400 mb-2">{article.published_at}</p>
              <h2 className="font-bold text-gray-900 mb-2 text-lg">{article.title}</h2>
              <p className="text-sm text-gray-600 mb-4">{article.excerpt}</p>
              <Link
                href={`/aktuelles/${article.slug}`}
                className="text-green-700 text-sm font-semibold hover:underline"
              >
                {t("read_more")} →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
    </>
  );
}
