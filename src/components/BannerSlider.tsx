"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";

type Banner = {
  id: string;
  title: string | null;
  media_url: string;
  media_type: "image" | "video";
  link_url: string | null;
};

function getYoutubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=0` : null;
}

export default function BannerSlider({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((i) => (i + 1) % banners.length), [banners.length]);
  const prev = () => setCurrent((i) => (i - 1 + banners.length) % banners.length);

  useEffect(() => {
    if (banners.length <= 1) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [banners.length, next]);

  if (banners.length === 0) return null;

  const banner = banners[current];
  const youtubeUrl = banner.media_type === "video" ? getYoutubeEmbedUrl(banner.media_url) : null;

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Link href={banner.link_url || "/veranstaltungen"} className="relative block w-full h-full">{children}</Link>
  );

  return (
    <div className="relative w-full h-[32rem] sm:h-[40rem] overflow-hidden rounded-2xl bg-gray-900 select-none">
      <Wrapper>
        {banner.media_type === "image" ? (
          <Image
            key={banner.id}
            src={banner.media_url}
            alt={banner.title ?? "Événement"}
            fill
            sizes="100vw"
            className="object-cover object-top transition-opacity duration-700"
            priority
          />
        ) : youtubeUrl ? (
          <iframe
            key={banner.id}
            src={youtubeUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            key={banner.id}
            src={banner.media_url}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Title + link badge */}
        <div className="absolute bottom-4 left-4 right-16 pointer-events-none">
          {banner.title && (
            <p className="text-white font-semibold text-base sm:text-lg drop-shadow line-clamp-2">{banner.title}</p>
          )}
          {banner.link_url && (
            <span className="inline-flex items-center gap-1 text-xs text-white/70 mt-1">
              <ExternalLink size={11} /> Voir plus
            </span>
          )}
        </div>
      </Wrapper>

      {/* Prev / Next */}
      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); prev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors z-10"
            aria-label="Précédent"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); next(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors z-10"
            aria-label="Suivant"
          >
            <ChevronRight size={18} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 right-4 flex gap-1.5 z-10">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setCurrent(i); }}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-white scale-125" : "bg-white/50"}`}
                aria-label={`Bannière ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
