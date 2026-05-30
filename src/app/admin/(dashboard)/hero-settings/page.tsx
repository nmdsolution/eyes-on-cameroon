import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import HeroSettingsClient from "./HeroSettingsClient";

export default async function HeroSettingsPage() {
  const supabase = await createClient();
  
  let heroSettings: { id: string; video_url: string | null } | null = null;
  try {
    const { data } = await supabase
      .from("hero_settings")
      .select("id, video_url")
      .single();
    heroSettings = data;
  } catch {
    // Table may not exist yet
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Vidéo Hero</h1>
        <p className="text-gray-500 text-sm mt-1">Gérer la vidéo du bouton "Voir la vidéo" dans la section hero</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <HeroSettingsClient initialData={heroSettings} />
      </div>
    </div>
  );
}
