import { Link } from "@/i18n/navigation";

interface Ad {
  href: string;
  external?: boolean;
  emoji: string;
  label: string;
  sub?: string;
  className: string;
  labelClassName: string;
  subClassName: string;
}

const ads: Ad[] = [
  {
    href: "https://web.facebook.com/loic.lef.7",
    external: true,
    emoji: "📢",
    label: "Loic Lef",
    sub: "Voir le profil Facebook",
    className:
      "bg-gradient-to-b from-blue-50 to-blue-100 border-blue-200 h-[250px]",
    labelClassName: "text-blue-700",
    subClassName: "text-blue-500",
  },
  {
    href: "/kontakt",
    external: false,
    emoji: "🌿",
    label: "",
    sub: "Contactez-nous",
    className:
      "bg-gradient-to-b from-green-50 to-green-100 border-green-200 h-[200px]",
    labelClassName: "text-green-700",
    subClassName: "text-green-600",
  },
];

export default function AdBanner() {
  return (
    <div className="sticky top-24 space-y-4">
      {ads.map((ad, i) =>
        ad.external ? (
          <a
            key={i}
            href={ad.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group rounded-xl border border-dashed flex flex-col items-center justify-center text-xs text-center p-4 select-none transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer ${ad.className}`}
          >
            <div className="text-2xl mb-2 transition-transform duration-200 group-hover:scale-110">
              {ad.emoji}
            </div>
            <div className={`font-semibold ${ad.labelClassName}`}>{ad.label}</div>
            {ad.sub && (
              <div className={`text-[10px] mt-1 underline underline-offset-2 ${ad.subClassName}`}>
                {ad.sub}
              </div>
            )}
          </a>
        ) : (
          <Link
            key={i}
            href={ad.href as "/kontakt"}
            className={`group rounded-xl border border-dashed flex flex-col items-center justify-center text-xs text-center p-4 select-none transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer ${ad.className}`}
          >
            <div className="text-2xl mb-2 transition-transform duration-200 group-hover:scale-110">
              {ad.emoji}
            </div>
            <div className={`font-semibold ${ad.labelClassName}`}>{ad.label}</div>
            {ad.sub && (
              <div className={`text-[10px] mt-2 ${ad.subClassName}`}>{ad.sub}</div>
            )}
          </Link>
        )
      )}
    </div>
  );
}
