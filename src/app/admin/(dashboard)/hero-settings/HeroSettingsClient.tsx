"use client";

import { useState } from "react";
import { Loader2, Check, Save } from "lucide-react";
import VideoUpload from "@/components/VideoUpload";

type HeroSettings = {
  id: string;
  video_url: string | null;
};

export default function HeroSettingsClient({ initialData }: { initialData: HeroSettings | null }) {
  const [videoUrl, setVideoUrl] = useState<string | null>(initialData?.video_url ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/admin/api/hero-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ video_url: videoUrl }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vidéo Hero
        </label>
        <VideoUpload
          value={videoUrl}
          onChange={setVideoUrl}
          folder="hero"
        />
        <p className="text-xs text-gray-500 mt-2">
          Cette vidéo sera affichée quand on clique sur le bouton "Voir la vidéo" dans la section hero.
        </p>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
      
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-60"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : success ? <Check size={14} /> : <Save size={14} />}
          {loading ? "Enregistrement..." : success ? "Enregistré" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
