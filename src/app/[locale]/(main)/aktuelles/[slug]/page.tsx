import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PlaceholderImage from "@/components/PlaceholderImage";
import Image from "next/image";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  let article: { title: string; content: string; published_at: string; cover_url?: string } | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("articles")
      .select("title, content, published_at, cover_url")
      .eq("slug", slug)
      .single();
    article = data;
  } catch {
    // Supabase not configured yet
  }

  const placeholderSlugs = ["jahrestreffen-2024", "schulprojekt-2024", "kulturabend-2024", "spendenaktion-2024"];
  if (!article && !placeholderSlugs.includes(slug)) {
    notFound();
  }

  const fallbackArticle = article ?? {
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    content: t("coming_soon"),
    published_at: new Date().toISOString().split("T")[0],
  };

  const formattedDate = new Date(fallbackArticle.published_at).toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link href="/aktuelles" className="inline-flex items-center gap-2 text-green-700 mb-8 hover:underline">
        <ArrowLeft size={16} /> {t("back")}
      </Link>
      <p className="text-sm text-gray-400 mb-4">{formattedDate}</p>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">{fallbackArticle.title}</h1>
      {fallbackArticle.cover_url ? (
        <div className="relative h-64 rounded-2xl overflow-hidden mb-8">
          <Image src={fallbackArticle.cover_url} alt={fallbackArticle.title} fill sizes="(max-width: 768px) 100vw, 800px" className="object-cover object-top" />
        </div>
      ) : (
        <PlaceholderImage className="h-64 rounded-2xl mb-8" label={fallbackArticle.title} />
      )}
      <div className="prose prose-green max-w-none text-gray-700 leading-relaxed">
        <p>{fallbackArticle.content}</p>
      </div>
    </div>
  );
}
