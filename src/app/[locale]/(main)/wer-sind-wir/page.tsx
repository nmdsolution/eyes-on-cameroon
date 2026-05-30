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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
  );
}
