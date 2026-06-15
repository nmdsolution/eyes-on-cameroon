"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Calendar, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import PlaceholderImage from "./PlaceholderImage";

interface FeaturedEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  image_url?: string;
}

export default function FeaturedEventsSlider({ events }: { events: FeaturedEvent[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (events.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % events.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [events.length]);

  if (!events.length) return null;

  const event = events[current];

  return (
    <div className="sticky top-24 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-green-700 px-4 py-2.5 flex items-center justify-between">
        <span className="text-white text-xs font-bold uppercase tracking-wider">
          Événements à la une
        </span>
        <span className="text-green-300 text-xs">
          {current + 1}/{events.length}
        </span>
      </div>

      <div className="relative overflow-hidden">
        <Link href={`/veranstaltungen/${event.id}`} className="block group">
          {event.image_url ? (
            <div className="relative h-44 overflow-hidden">
              <Image
                src={event.image_url}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ) : (
            <PlaceholderImage className="h-44" label={event.title} />
          )}

          <div className="p-4">
            <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-3 group-hover:text-green-700 transition-colors">
              {event.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5">
              <Calendar size={12} className="text-green-700 shrink-0" />
              <span>
                {new Date(event.date).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin size={12} className="text-green-700 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>
        </Link>

        {events.length > 1 && (
          <div className="flex items-center justify-between px-4 pb-4">
            <button
              onClick={() =>
                setCurrent((prev) => (prev - 1 + events.length) % events.length)
              }
              className="p-1.5 rounded-full bg-gray-100 hover:bg-green-100 hover:text-green-700 transition-colors"
              aria-label="Précédent"
            >
              <ChevronLeft size={14} />
            </button>

            <div className="flex gap-1 items-center">
              {events.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-4 h-1.5 bg-green-700"
                      : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Événement ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrent((prev) => (prev + 1) % events.length)}
              className="p-1.5 rounded-full bg-gray-100 hover:bg-green-100 hover:text-green-700 transition-colors"
              aria-label="Suivant"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
