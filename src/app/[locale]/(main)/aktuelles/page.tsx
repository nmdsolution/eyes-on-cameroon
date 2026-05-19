import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
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
  const t = await getTranslations("news");

  let articles: Array<{ id: string; title: string; excerpt: string; published_at: string; slug: string; cover_url?: string }> = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("articles")
      .select("id, title, excerpt, published_at, slug, cover_url")
      .order("published_at", { ascending: false });
    articles = data ?? [];
  } catch {
    // Supabase not configured yet — show placeholder
  }

  const placeholderArticles = articles.length > 0 ? articles : [
    { id: "1", title: "Jahrestreffen 2024", excerpt: "Unser jährliches Treffen war ein voller Erfolg.", published_at: "2024-11-15", slug: "jahrestreffen-2024" },
    { id: "2", title: "Neues Schulprojekt", excerpt: "Wir starten ein neues Bildungsprojekt in Kamerun.", published_at: "2024-09-01", slug: "schulprojekt-2024" },
    { id: "3", title: "Kulturabend", excerpt: "Ein unvergesslicher Abend voller kamerunischer Kultur.", published_at: "2024-07-20", slug: "kulturabend-2024" },
    { id: "4", title: "Spendenaktion", excerpt: "Unsere Spendenaktion hat 5.000 Euro erreicht.", published_at: "2024-05-10", slug: "spendenaktion-2024" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <p className="text-gray-500 mb-10">{t("subtitle")}</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {placeholderArticles.map((article) => (
          <article key={article.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
            {article.cover_url ? (
              <div className="relative h-44">
                <Image src={article.cover_url} alt={article.title} fill className="object-cover" />
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
  );
}
