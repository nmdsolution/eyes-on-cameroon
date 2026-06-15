import { createClient } from "@/lib/supabase/server";
import HeroSettingsClient from "./HeroSettingsClient";

export default async function HeroSettingsPage() {
  const supabase = await createClient();

  let heroSettings: {
    id: string;
    media_type: "video" | "image" | null;
    video_url: string | null;
    image_url: string | null;
  } | null = null;

  try {
    const { data } = await supabase
      .from("hero_settings")
      .select("id, media_type, video_url, image_url")
      .single();
    heroSettings = data;
  } catch {
    // Table may not exist yet
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Vidéo Hero</h1>
        <p className="text-gray-500 text-sm mt-1">
          Gérer le média du bouton dans la section hero — vidéo (YouTube ou fichier) ou image fixe
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <HeroSettingsClient initialData={heroSettings} />
      </div>
    </div>
  );
}
