"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { User, X, ZoomIn } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo_url?: string;
}

function roleBadgeColor(role: string) {
  const r = role.toLowerCase();
  if (r.includes("vorsitz") || r.includes("président") || r.includes("president")) return "bg-yellow-400 text-yellow-900";
  if (r.includes("stellv") || r.includes("vice") || r.includes("adjoint")) return "bg-green-600 text-white";
  if (r.includes("finanz") || r.includes("trésor")) return "bg-blue-600 text-white";
  if (r.includes("sekret") || r.includes("secrét")) return "bg-purple-600 text-white";
  return "bg-gray-700 text-white";
}

export function TeamMemberCardFeatured({ member }: { member: TeamMember }) {
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
      <div className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 grid md:grid-cols-2">
        {/* Photo */}
        <div
          className="relative h-72 md:h-auto min-h-[320px] overflow-hidden cursor-zoom-in"
          onClick={() => member.photo_url && setOpen(true)}
        >
          {member.photo_url ? (
            <Image
              src={member.photo_url}
              alt={member.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-green-100 flex items-center justify-center">
              <User size={64} className="text-green-400" />
            </div>
          )}
          {/* Zoom hint */}
          {member.photo_url && (
            <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ZoomIn size={16} className="text-white" />
            </div>
          )}
          {/* Role badge */}
          <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow ${roleBadgeColor(member.role)}`}>
            {member.role}
          </span>
        </div>

        {/* Info */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="inline-block w-12 h-1 rounded-full bg-green-500 mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors duration-300">
            {member.name}
          </h2>
          <p className="text-green-600 font-semibold mb-6">{member.role}</p>
          <p className="text-gray-500 leading-relaxed">{member.bio}</p>
          <div className="mt-8 flex gap-3">
            <div className="h-1.5 w-6 rounded-full bg-green-500" />
            <div className="h-1.5 w-6 rounded-full bg-red-500" />
            <div className="h-1.5 w-6 rounded-full bg-yellow-400" />
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {open && member.photo_url && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
            onClick={() => setOpen(false)}
          >
            <X size={24} />
          </button>
          <div
            className="relative max-w-lg w-full max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={member.photo_url}
              alt={member.name}
              width={600}
              height={800}
              className="w-full h-auto object-cover object-top"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-6 py-5">
              <p className="text-white font-bold text-lg">{member.name}</p>
              <p className="text-green-300 text-sm">{member.role}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function TeamMemberCard({ member }: { member: TeamMember }) {
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
      <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
        {/* Photo portrait */}
        <div
          className="relative h-64 overflow-hidden cursor-zoom-in"
          onClick={() => member.photo_url && setOpen(true)}
        >
          {member.photo_url ? (
            <Image
              src={member.photo_url}
              alt={member.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-green-50 flex items-center justify-center">
              <User size={48} className="text-green-300" />
            </div>
          )}
          {/* Gradient bottom */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
          {/* Role badge */}
          <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${roleBadgeColor(member.role)}`}>
            {member.role}
          </span>
          {/* Zoom hint */}
          {member.photo_url && (
            <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ZoomIn size={14} className="text-white" />
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-5">
          <h3 className="font-bold text-gray-900 text-base group-hover:text-green-700 transition-colors duration-300">
            {member.name}
          </h3>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">{member.bio}</p>
        </div>
      </div>

      {/* Lightbox */}
      {open && member.photo_url && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
            onClick={() => setOpen(false)}
          >
            <X size={24} />
          </button>
          <div
            className="relative max-w-lg w-full max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={member.photo_url}
              alt={member.name}
              width={600}
              height={800}
              className="w-full h-auto object-cover object-top"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-6 py-5">
              <p className="text-white font-bold text-lg">{member.name}</p>
              <p className="text-green-300 text-sm">{member.role}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
