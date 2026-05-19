import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Building2 } from "lucide-react";
import Image from "next/image";

// Local partner images from public/images/partenaire
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

export default async function PartnersPage() {
  const t = await getTranslations("partners");

  // Fetch from Supabase or use local images
  let partners: Array<{ id: string; name: string; website?: string; logo_url?: string; description?: string }> = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("partners").select("id, name, website, logo_url, description");
    partners = data ?? [];
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <p className="text-gray-500 mb-10">{t("subtitle")}</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayPartners.map((partner) => (
          <div key={partner.id} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <div className="relative w-20 h-20 mb-4">
              {partner.logo_url ? (
                <Image src={partner.logo_url} alt={partner.name} fill className="object-contain" />
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
  );
}
