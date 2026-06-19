import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image
                src="/images/logo.png"
                alt="Eyes on Cameroon"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="text-white font-bold text-lg">Eyes on Cameroon</span>
            </div>
            <p className="text-sm text-gray-400">{t("description")}</p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t("navigation")}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/wer-sind-wir" className="hover:text-green-400 transition-colors">{tNav("about")}</Link></li>
              <li><Link href="/aktuelles" className="hover:text-green-400 transition-colors">{tNav("news")}</Link></li>
              <li><Link href="/veranstaltungen" className="hover:text-green-400 transition-colors">{tNav("events")}</Link></li>
              <li><Link href="/team" className="hover:text-green-400 transition-colors">{tNav("team")}</Link></li>
              <li><Link href="/kontakt" className="hover:text-green-400 transition-colors">{tNav("contact")}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">{tNav("contact")}</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-green-400 shrink-0" />
                <a href="mailto:info@eyesoncameroon.de" className="hover:text-green-400 transition-colors">
                  info@eyesoncameroon.de
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-green-400 shrink-0 mt-0.5" />
                <span>{t("location")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Eyes on Cameroon. {t("rights")}.</p>
          <div className="flex gap-4">
            <Link href="/datenschutz" className="hover:text-green-400 transition-colors">{t("privacy")}</Link>
            <Link href="/impressum" className="hover:text-green-400 transition-colors">{t("imprint")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
