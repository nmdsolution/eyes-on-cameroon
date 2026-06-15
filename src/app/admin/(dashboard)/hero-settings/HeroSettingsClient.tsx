"use client";

import { useState } from "react";
import { Loader2, Check, Save, Video as VideoIcon, ImageIcon, Link as LinkIcon } from "lucide-react";
import VideoUpload from "@/components/VideoUpload";
import ImageUpload from "@/components/ImageUpload";

type MediaType = "video" | "image";
type VideoSource = "url" | "upload";

type HeroSettings = {
  id: string;
  media_type: MediaType | null;
  video_url: string | null;
  image_url: string | null;
};

export default function HeroSettingsClient({ initialData }: { initialData: HeroSettings | null }) {
  const [mediaType, setMediaType] = useState<MediaType>(initialData?.media_type ?? "video");
  const [videoSource, setVideoSource] = useState<VideoSource>("url");
  const [videoUrl, setVideoUrl] = useState<string | null>(initialData?.video_url ?? null);
  const [imageUrl, setImageUrl] = useState<string | null>(initialData?.image_url ?? null);
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
        body: JSON.stringify({ media_type: mediaType, video_url: videoUrl, image_url: imageUrl }),
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
      {/* Mode selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Type de média
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setMediaType("video")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
              mediaType === "video"
                ? "bg-green-700 text-white border-green-700"
                : "bg-white text-gray-600 border-gray-300 hover:border-green-400"
            }`}
          >
            <VideoIcon size={16} /> Vidéo
          </button>
          <button
            type="button"
            onClick={() => setMediaType("image")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
              mediaType === "image"
                ? "bg-green-700 text-white border-green-700"
                : "bg-white text-gray-600 border-gray-300 hover:border-green-400"
            }`}
          >
            <ImageIcon size={16} /> Image fixe
          </button>
        </div>
      </div>

      {/* Video panel */}
      {mediaType === "video" && (
        <div className="space-y-4">
          {/* Video source tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              type="button"
              onClick={() => setVideoSource("url")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                videoSource === "url"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <LinkIcon size={13} /> URL YouTube
            </button>
            <button
              type="button"
              onClick={() => setVideoSource("upload")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                videoSource === "upload"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <VideoIcon size={13} /> Importer un fichier
            </button>
          </div>

          {videoSource === "url" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Lien YouTube
              </label>
              <input
                type="url"
                value={videoUrl ?? ""}
                onChange={(e) => setVideoUrl(e.target.value || null)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">
                Accepte les formats youtube.com/watch?v= et youtu.be/
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Fichier vidéo
              </label>
              <VideoUpload value={videoUrl} onChange={setVideoUrl} folder="hero" />
              <p className="text-xs text-gray-400 mt-1">
                Formats acceptés : MP4, WebM, OGG
              </p>
            </div>
          )}

          {videoUrl && videoSource === "url" && (
            <div className="rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-900">
              <iframe
                src={(() => {
                  const match = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
                  return match ? `https://www.youtube.com/embed/${match[1]}` : undefined;
                })()}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          )}
        </div>
      )}

      {/* Image panel */}
      {mediaType === "image" && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Image fixe
          </label>
          <ImageUpload value={imageUrl} onChange={setImageUrl} folder="hero" />
          <p className="text-xs text-gray-400">
            L&apos;image s&apos;affichera dans une fenêtre modale quand on clique sur le bouton
            dans la section hero.
          </p>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-60 transition-colors"
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : success ? (
            <Check size={14} />
          ) : (
            <Save size={14} />
          )}
          {loading ? "Enregistrement..." : success ? "Enregistré ✓" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
