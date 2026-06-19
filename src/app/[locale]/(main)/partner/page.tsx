import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Building2 } from "lucide-react";
import Image from "next/image";

// Local fallback partner images — used when the database has no partner data
const partnerImages = [
  { name: "Orange", description: "Telekommunikationspartner", image: "/images/partenaire/logo_orange.jpg", website: "https://orange.cm" },
  { name: "MTN", description: "Mobilfunkpartner", image: "/images/partenaire/mtn.png", website: "https://mtn.cm" },
  { name: "Yango", description: "Mobilitätspartner", image: "/images/partenaire/yogo.png", website: "https://yango.com" },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "partners" });
  return { title: t("title") };
}

export default async function PartnersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "partners" });

  let partners: Array<{ id: string; name: string; website?: string; logo_url?: string; description?: string }> = [];
  try {
    const supabase = await createClient();
    // Try locale-specific rows first, then fall back to all rows (backward compat)
    const { data: localeData } = await supabase
      .from("partners")
      .select("id, name, website, logo_url, description")
      .eq("locale", locale);

    if (localeData && localeData.length > 0) {
      partners = localeData;
    } else {
      const { data: allData } = await supabase
        .from("partners")
        .select("id, name, website, logo_url, description");
      partners = allData ?? [];
    }
  } catch {
    console.error("Failed to fetch partners");
  }

  // Use local images if no Supabase data
  const displayPartners = partners.length > 0 ? partners : partnerImages.map((p, i) => ({
    id: String(i + 1),
    name: p.name,
    description: p.description,
    logo_url: p.image,
    website: p.website,
  }));

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
        {displayPartners.map((partner) => (
          <div key={partner.id} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="relative w-20 h-20 mb-4">
              {partner.logo_url ? (
                <Image src={partner.logo_url} alt={partner.name} fill sizes="80px" className="object-contain" />
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Building2 size={32} className="text-gray-400" />
                </div>
              )}
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{partner.name}</h3>
            {partner.description && <p className="text-xs text-gray-500">{partner.description}</p>}
            {partner.website && (
              <a href={partner.website} target="_blank" rel="noopener noreferrer" className="mt-3 text-xs text-green-700 hover:underline">
                Website →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
