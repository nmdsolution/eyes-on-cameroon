"use client";

import { Play } from "lucide-react";

export default function VideoButton() {
  return (
    <button
      onClick={() => alert("Vidéo à venir")}
      className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-green-900 font-semibold rounded-full hover:bg-yellow-400 transition-colors"
    >
      <Play size={18} fill="currentColor" /> Voir la vidéo
    </button>
  );
}
