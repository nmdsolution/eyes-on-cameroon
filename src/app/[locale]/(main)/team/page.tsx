import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { User } from "lucide-react";
import Image from "next/image";

// Local team images from public/images/team
const teamImages = [
  { name: "Dr. GHISLAIN MOUI SIL", role: "Vorsitzende/r", bio: "Leitet den Vorstand und die strategische Ausrichtung.", image: "/images/team/Dr. GHISLAIN MOUI SIL.jpg" },
  { name: "ESTELLE WAMY-ALTHOFF", role: "Stellvertretung", bio: "Unterstützt den Vorsitz und koordiniert die Teams.", image: "/images/team/ESTELLE WAMY-ALTHOFF.jpg" },
  { name: "NATACHA TIMMA", role: "Finanzen", bio: "Verantwortlich für die Finanzen der Organisation.", image: "/images/team/NATACHA TIMMA.jpg" },
  { name: "SABINE MBALLA", role: "Sekretariat", bio: "Protokolliert Sitzungen und verwaltet die Korrespondenz.", image: "/images/team/SABINE MBALLA.jpg" },
  { name: "SANDRA LEFANG", role: "Mitglied", bio: "Aktives Mitglied bei Projekten und Veranstaltungen.", image: "/images/team/SANDRA LEFANG.jpg" },
  { name: "TISSU OTTOU", role: "Mitglied", bio: "Engagiert sich für Kultur und Vernetzung.", image: "/images/team/TISSU OTTOU.jpg" },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "team" });
  return { title: t("title") };
}

export default async function TeamPage() {
  const t = await getTranslations("team");

  // Fetch from Supabase or use local images
  let members: Array<{ id: string; name: string; role: string; bio: string; photo_url?: string }> = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("team_members")
      .select("id, name, role, bio, photo_url")
      .order("order", { ascending: true });
    members = data ?? [];
  } catch {
    console.error("Failed to fetch team members");
  }

  // Use local images if no Supabase data
  const displayMembers = members.length > 0 ? members : teamImages.map((m, i) => ({
    id: String(i + 1),
    name: m.name,
    role: m.role,
    bio: m.bio,
    photo_url: m.image,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <p className="text-gray-500 mb-10">{t("subtitle")}</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayMembers.map((member) => (
          <div key={member.id} className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-md transition-shadow">
            <div className="relative w-20 h-20 mx-auto mb-4">
              {member.photo_url ? (
                <Image src={member.photo_url} alt={member.name} fill className="rounded-full object-cover" />
              ) : (
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <User size={36} className="text-green-600" />
                </div>
              )}
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
            <p className="text-sm text-green-700 font-medium mb-3">{member.role}</p>
            <p className="text-xs text-gray-500">{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
