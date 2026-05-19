import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Heart, CreditCard, Building } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "donate" });
  return { title: t("title") };
}

export default async function DonatePage() {
  const t = await getTranslations("donate");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Heart size={32} className="text-green-700" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("title")}</h1>
        <p className="text-gray-600 text-lg">{t("description")}</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Building size={20} className="text-green-700" />
          Bankverbindung
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <span className="text-gray-500">Kontoinhaber</span>
            <span className="font-semibold text-gray-900">Eyes on Cameroon e.V.</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <span className="text-gray-500">IBAN</span>
            <span className="font-mono font-semibold text-gray-900">DE XX XXXX XXXX XXXX XXXX XX</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-3">
            <span className="text-gray-500">BIC</span>
            <span className="font-mono font-semibold text-gray-900">XXXXXXXX</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Verwendungszweck</span>
            <span className="font-semibold text-gray-900">Spende</span>
          </div>
        </div>
        <p className="mt-6 text-xs text-gray-400">
          Eyes on Cameroon e.V. ist als gemeinnützig anerkannt. Spenden sind steuerlich absetzbar.
          Spendenbescheinigungen werden auf Anfrage ausgestellt.
        </p>
      </div>
    </div>
  );
}
