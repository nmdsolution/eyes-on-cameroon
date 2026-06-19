import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title") };
}

export default function AboutPage() {
  const t = useTranslations("about");
  return (
    <>
      <section className="relative bg-green-900 text-white overflow-hidden py-6 md:py-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-green-700/40 via-transparent to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-block w-10 h-1 rounded-full bg-yellow-400" />
            <span className="text-yellow-300 font-semibold text-sm uppercase tracking-widest">{t("title")}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">{t("activities_title")}</h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex h-1.5">
          <div className="flex-1 bg-green-500" /><div className="flex-1 bg-red-600" /><div className="flex-1 bg-yellow-400" />
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Left column - Image */}
        <div className="relative rounded-2xl h-80 md:h-[500px] overflow-hidden shadow-lg sticky top-24">
          <Image
            src="/images/apropo.jpg"
            alt="About Eyes on Cameroon"
            fill
            className="object-cover"
          />
        </div>

        {/* Right column - Content */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{t("title")}</h1>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">{t("description")}</p>
          <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-xl">
            <h2 className="text-xl font-bold text-green-800 mb-3">{t("activities_title")}</h2>
            <p className="text-gray-700 leading-relaxed">{t("activities_text")}</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
