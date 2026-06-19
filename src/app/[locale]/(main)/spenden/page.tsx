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
    <>
      <section className="relative bg-green-900 text-white overflow-hidden py-6 md:py-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-green-700/40 via-transparent to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-block w-10 h-1 rounded-full bg-yellow-400" />
            <span className="text-yellow-300 font-semibold text-sm uppercase tracking-widest">{t("title")}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">{t("description")}</h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex h-1.5">
          <div className="flex-1 bg-green-500" /><div className="flex-1 bg-red-600" /><div className="flex-1 bg-yellow-400" />
        </div>
      </section>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

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
    </>
  );
}
