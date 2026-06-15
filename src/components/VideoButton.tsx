"use client";

import { useState } from "react";
import { Play, X, ImageIcon } from "lucide-react";

interface VideoButtonProps {
  videoUrl?: string | null;
  imageUrl?: string | null;
  mediaType?: "video" | "image" | null;
}

export default function VideoButton({ videoUrl, imageUrl, mediaType }: VideoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isImage = mediaType === "image" && !!imageUrl;
  const isVideo = (mediaType === "video" || !mediaType) && !!videoUrl;

  if (!isImage && !isVideo) return null;

  const getYoutubeEmbedUrl = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : null;
  };

  const youtubeUrl = isVideo ? getYoutubeEmbedUrl(videoUrl!) : null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-green-900 font-semibold rounded-full hover:bg-yellow-400 transition-colors"
      >
        {isImage ? (
          <>
            <ImageIcon size={18} /> Voir l&apos;image
          </>
        ) : (
          <>
            <Play size={18} fill="currentColor" /> Voir la vidéo
          </>
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className={`relative w-full bg-black rounded-xl overflow-hidden ${
              isImage ? "max-w-4xl" : "max-w-4xl aspect-video"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 z-10 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
              aria-label="Fermer"
            >
              <X size={22} />
            </button>

            {isImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={imageUrl!}
                alt="Aperçu hero"
                className="w-full h-auto max-h-[85vh] object-contain"
              />
            ) : youtubeUrl ? (
              <iframe
                src={youtubeUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={videoUrl!}
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
