"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";

export default function VideoButton({ videoUrl }: { videoUrl?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!videoUrl) return null;

  const getYoutubeEmbedUrl = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : null;
  };

  const youtubeUrl = getYoutubeEmbedUrl(videoUrl);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-green-900 font-semibold rounded-full hover:bg-yellow-400 transition-colors"
      >
        <Play size={18} fill="currentColor" /> Voir la vidéo
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
            >
              <X size={24} />
            </button>
            {youtubeUrl ? (
              <iframe
                src={youtubeUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={videoUrl}
                className="w-full h-full"
                controls
                autoPlay
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
