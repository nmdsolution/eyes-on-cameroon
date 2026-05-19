"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Menu, X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { routing } from "@/i18n/routing";
import Image from "next/image";

const localeLabels: Record<string, string> = {
  de: "DE",
  fr: "FR",
  en: "EN",
};

export default function Header({ locale }: { locale: string }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/wer-sind-wir", label: t("about") },
    { href: "/aktuelles", label: t("news") },
    { href: "/veranstaltungen", label: t("events") },
    { href: "/team", label: t("team") },
    { href: "/partner", label: t("partners") },
    { href: "/kontakt", label: t("contact") },
  ];

  const pathWithoutLocale = pathname.replace(/^\/(de|fr|en)/, "") || "/";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Eyes on Cameroon"
              width={140}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-green-700",
                  pathname.endsWith(link.href) && link.href !== "/"
                    ? "text-green-700"
                    : "text-gray-700"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-green-700"
              >
                <Globe size={16} />
                {localeLabels[locale]}
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                  {routing.locales.map((loc) => (
                    <a
                      key={loc}
                      href={`/${loc}${pathWithoutLocale}`}
                      onClick={() => setLangOpen(false)}
                      className={cn(
                        "block px-4 py-2 text-sm hover:bg-green-50 hover:text-green-700",
                        loc === locale ? "text-green-700 font-semibold" : "text-gray-700"
                      )}
                    >
                      {localeLabels[loc]}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Donate button */}
            <Link
              href="/spenden"
              className="hidden sm:inline-flex items-center px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-full hover:bg-green-800 transition-colors"
            >
              {t("donate")}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden text-gray-700"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <nav className="px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-gray-700 hover:text-green-700 font-medium py-2"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/spenden"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-full hover:bg-green-800"
            >
              {t("donate")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
