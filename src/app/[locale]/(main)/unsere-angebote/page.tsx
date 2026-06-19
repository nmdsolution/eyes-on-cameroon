import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "offers" });
  return { title: t("title"), description: t("subtitle") };
}

const sections = [
  { key: "cultural", image: "/images/offre/culturel.jpg", reverse: false },
  { key: "social", image: "/images/offre/social.jpg", reverse: true },
  { key: "dev", image: "/images/offre/politique et develpement.jpg", reverse: false },
] as const;

export default function OffersPage() {
  const t = useTranslations("offers");

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Sections */}
      <div className="flex flex-col gap-24">
        {sections.map(({ key, image, reverse }) => (
          <div
            key={key}
            className={`grid md:grid-cols-2 gap-12 items-center ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}
          >
            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg h-72 md:h-96">
              <Image
                src={image}
                alt={t(`${key}_title` as Parameters<typeof t>[0])}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-950/40 to-transparent" />
            </div>

            {/* Text */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t(`${key}_title` as Parameters<typeof t>[0])}
              </h2>
              <p className="text-gray-700 font-medium leading-relaxed mb-4">
                {t(`${key}_intro` as Parameters<typeof t>[0])}
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                {t(`${key}_text` as Parameters<typeof t>[0])}
              </p>
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 text-white font-semibold rounded-full hover:bg-green-800 transition-colors"
              >
                {t("contact_button")} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
