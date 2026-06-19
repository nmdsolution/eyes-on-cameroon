"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";

export default function HeroImage({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Hero image with zoom + click */}
      <div
        className="absolute inset-0 cursor-zoom-in group/img"
        onClick={() => setOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
          priority
        />
        <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 pointer-events-none">
          <ZoomIn size={20} className="text-white" />
        </div>
      </div>

      {/* Lightbox — image plein écran en fond */}
      {open && (
        <div
          className="fixed inset-0 z-50 cursor-zoom-out"
          onClick={() => setOpen(false)}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover object-top"
            priority
          />
          <button
            className="absolute top-4 right-4 text-white bg-black/30 hover:bg-black/50 rounded-full p-2 transition-colors z-10"
            onClick={() => setOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
      )}
    </>
  );
}
