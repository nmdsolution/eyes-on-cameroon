"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

const DELAY_MS = 4000;

export default function PromoPopup() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={() => setVisible(false)}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image complète */}
        <div className="relative">
          <Image
            src="/images/pupup-cameroon.jpeg"
            alt="Événements Eyes on Cameroon"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </div>

        {/* Close button */}
        <button
          className="absolute top-3 right-3 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 transition-colors"
          onClick={() => setVisible(false)}
        >
          <X size={18} />
        </button>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-yellow-300 text-xs font-bold uppercase tracking-widest mb-1">
            Découvrez
          </p>
          <h2 className="text-white text-xl font-bold mb-4 leading-snug">
            Nos prochains événements
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setVisible(false);
                router.push(`/${locale}/veranstaltungen`);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-full transition-colors text-sm"
            >
              Voir les événements <ArrowRight size={15} />
            </button>
            <button
              onClick={() => setVisible(false)}
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              Plus tard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
