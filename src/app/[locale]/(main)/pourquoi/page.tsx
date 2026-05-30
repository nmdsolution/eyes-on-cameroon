import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Users, Globe2, Star } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "why" });
  return { title: t("title"), description: t("subtitle") };
}

export default function WhyPage() {
  const t = useTranslations("why");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Image + content side by side */}
      <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
        {/* Left — Image */}
        <div className="relative rounded-2xl h-80 md:h-full min-h-[400px] overflow-hidden shadow-lg md:sticky top-24">
          <Image
            src="/images/pourqoi.jpg"
            alt="Cameroon"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green-950/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 flex h-2">
            <div className="flex-1 bg-green-500" />
            <div className="flex-1 bg-red-600" />
            <div className="flex-1 bg-yellow-400" />
          </div>
        </div>

        {/* Right — Title, subtitle, two reasons */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">{t("title")}</h1>
            <p className="text-lg text-gray-500">{t("subtitle")}</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <Users size={18} className="text-green-700" />
              </div>
              <h2 className="text-base font-bold text-gray-900">{t("reason1_title")}</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">{t("reason1_text")}</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                <Globe2 size={18} className="text-green-700" />
              </div>
              <h2 className="text-base font-bold text-gray-900">{t("reason2_title")}</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">{t("reason2_text")}</p>
          </div>
        </div>
      </div>

      {/* Long-term vision */}
      <div className="bg-green-50 border border-green-100 rounded-2xl p-8 mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center shrink-0">
            <Star size={20} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-green-900">{t("vision_title")}</h2>
        </div>
        <p className="text-gray-700 leading-relaxed text-lg">{t("vision_text")}</p>
      </div>

      {/* CTA */}
      <div className="bg-green-700 rounded-2xl p-10 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">{t("cta_title")}</h2>
        <p className="text-green-100 mb-6 max-w-lg mx-auto">{t("cta_text")}</p>
        <Link
          href="/kontakt"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-800 font-semibold rounded-full hover:bg-green-50 transition-colors"
        >
          {t("cta_button")} <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
