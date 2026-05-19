import { createAdminClient } from "@/lib/supabase/admin";
import { Newspaper, Calendar, Users, Handshake, MessageSquare } from "lucide-react";
import Link from "next/link";

async function getCounts() {
  const supabase = await createAdminClient();
  const [articles, events, team, partners, messages] = await Promise.all([
    supabase.from("articles").select("id", { count: "exact", head: true }),
    supabase.from("events").select("id", { count: "exact", head: true }),
    supabase.from("team_members").select("id", { count: "exact", head: true }),
    supabase.from("partners").select("id", { count: "exact", head: true }),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }),
  ]);
  return {
    articles: articles.count ?? 0,
    events: events.count ?? 0,
    team: team.count ?? 0,
    partners: partners.count ?? 0,
    messages: messages.count ?? 0,
  };
}

export default async function AdminDashboard() {
  const counts = await getCounts();

  const cards = [
    { label: "Articles", count: counts.articles, href: "/admin/articles", icon: Newspaper, color: "bg-blue-50 text-blue-600" },
    { label: "Events", count: counts.events, href: "/admin/events", icon: Calendar, color: "bg-purple-50 text-purple-600" },
    { label: "Team Members", count: counts.team, href: "/admin/team", icon: Users, color: "bg-green-50 text-green-600" },
    { label: "Partners", count: counts.partners, href: "/admin/partners", icon: Handshake, color: "bg-yellow-50 text-yellow-600" },
    { label: "Messages", count: counts.messages, href: "/admin/messages", icon: MessageSquare, color: "bg-red-50 text-red-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">Overview of all content</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map(({ label, count, href, icon: Icon, color }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">{count}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
