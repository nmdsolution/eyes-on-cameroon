import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import TeamMemberCard, { TeamMemberCardFeatured } from "@/components/TeamMemberCard";
import { Users } from "lucide-react";

const teamImages = [
  { name: "Dr. GHISLAIN MOUI SIL", role: "Vorsitzende/r", bio: "Leitet den Vorstand und die strategische Ausrichtung der Vereinigung.", image: "/images/team/Dr. GHISLAIN MOUI SIL.jpg" },
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

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "team" });

  let members: Array<{ id: string; name: string; role: string; bio: string; photo_url?: string }> = [];
  try {
    const supabase = await createClient();
    const { data: localeData } = await supabase
      .from("team_members")
      .select("id, name, role, bio, photo_url")
      .eq("locale", locale)
      .order("order", { ascending: true });

    if (localeData && localeData.length > 0) {
      members = localeData;
    } else {
      const { data: allData } = await supabase
        .from("team_members")
        .select("id, name, role, bio, photo_url")
        .order("order", { ascending: true });
      members = allData ?? [];
    }
  } catch {
    console.error("Failed to fetch team members");
  }

  const displayMembers = members.length > 0 ? members : teamImages.map((m, i) => ({
    id: String(i + 1),
    name: m.name,
    role: m.role,
    bio: m.bio,
    photo_url: m.image,
  }));

  const featured = displayMembers[0];
  const rest = displayMembers.slice(1);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative bg-green-900 text-white overflow-hidden py-6 md:py-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-green-700/40 via-transparent to-transparent" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-block w-10 h-1 rounded-full bg-yellow-400" />
            <span className="text-yellow-300 font-semibold text-sm uppercase tracking-widest">
              {t("title")}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            {t("subtitle")}
          </h1>
          <div className="flex items-center gap-2 text-green-300 text-sm">
            <Users size={16} />
            <span>{displayMembers.length} membres</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex h-1.5">
          <div className="flex-1 bg-green-500" />
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-yellow-400" />
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">

        {/* ── Featured: Président ── */}
        {featured && <TeamMemberCardFeatured member={featured} />}

        {/* ── Section divider ── */}
        {rest.length > 0 && (
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Membres du bureau
            </span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
        )}

        {/* ── Rest of team ── */}
        {rest.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
