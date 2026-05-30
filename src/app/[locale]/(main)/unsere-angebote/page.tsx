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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
  );
}
