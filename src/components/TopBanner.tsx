"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function TopBanner({ locale }: { locale: string }) {
  const [banners, setBanners] = useState<Array<{ title: string | null; link_url: string | null }>>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("pub_banners")
      .select("title, link_url")
      .eq("active", true)
      .eq("locale", locale)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setBanners(data);
        } else {
          supabase
            .from("pub_banners")
            .select("title, link_url")
            .eq("active", true)
            .order("sort_order", { ascending: true })
            .then(({ data: allData }) => setBanners(allData ?? []));
        }
      });
  }, [locale]);

  if (banners.length === 0) return null;

  const banner = banners[current];
  const content = banner?.title ?? "Eyes on Cameroon";

  function onScrollEnd() {
    if (banners.length > 1) {
      setCurrent((i) => (i + 1) % banners.length);
    }
  }

  const text = (
    <span
      key={current}
      onAnimationIteration={onScrollEnd}
      style={{
        display: "inline-block",
        whiteSpace: "nowrap",
        paddingBlock: "0.5rem",
        animation: "marquee-scroll 16s linear infinite",
      }}
    >
      {content}
    </span>
  );

  return (
    <div className="w-full bg-green-700 text-white overflow-hidden">
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(100vw); }
          to   { transform: translateX(-100%); }
        }
      `}</style>
      {banner?.link_url ? (
        <Link href={banner.link_url} className="block hover:bg-green-600 transition-colors">
          {text}
        </Link>
      ) : (
        <div>{text}</div>
      )}
    </div>
  );
}
