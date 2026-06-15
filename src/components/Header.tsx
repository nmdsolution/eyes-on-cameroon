"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { Menu, X, Globe, ChevronDown, UserCircle, UserPlus, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { routing } from "@/i18n/routing";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

const localeLabels: Record<string, string> = { de: "DE", fr: "FR", en: "EN" };
const localeFlags: Record<string, string> = { de: "🇩🇪", fr: "🇫🇷", en: "🇬🇧" };

type UserInfo = { name: string; initial: string };

export default function Header({ locale }: { locale: string }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const authRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    function buildUserInfo(user: { user_metadata?: Record<string, string>; email?: string } | null): UserInfo | null {
      if (!user) return null;
      const first = user.user_metadata?.first_name ?? "";
      const last = user.user_metadata?.last_name ?? "";
      const name = [first, last].filter(Boolean).join(" ") || user.email?.split("@")[0] || "Profil";
      const initial = (first || user.email || "P")[0].toUpperCase();
      return { name, initial };
    }

    supabase.auth.getUser().then(({ data }) => setUserInfo(buildUserInfo(data.user)));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserInfo(buildUserInfo(session?.user ?? null));
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close auth dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (authRef.current && !authRef.current.contains(e.target as Node)) {
        setAuthOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const aboutSubLinks = [
    { href: "/pourquoi", label: t("why") },
    { href: "/team", label: t("our_team") },
    { href: "/unsere-angebote", label: t("our_offers") },
  ];

  const navLinks = [
    { href: "/aktuelles", label: t("news") },
    { href: "/veranstaltungen", label: t("events") },
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
            <Image src="/images/logo.png" alt="Eyes on Cameroon" width={140} height={40} className="h-10 w-auto" priority />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/"
              className={cn("text-sm font-medium transition-colors hover:text-green-700", pathname.endsWith("/") ? "text-green-700" : "text-gray-700")}
            >
              {t("home")}
            </Link>

            {/* About dropdown */}
            <div className="relative" onMouseEnter={() => setAboutOpen(true)} onMouseLeave={() => setAboutOpen(false)}>
              <Link
                href="/wer-sind-wir"
                className={cn(
                  "flex items-center gap-1 text-sm font-medium transition-colors hover:text-green-700",
                  pathname.includes("/wer-sind-wir") || pathname.includes("/team") ? "text-green-700" : "text-gray-700"
                )}
              >
                {t("about")}
                <ChevronDown size={14} className={cn("transition-transform duration-200", aboutOpen ? "rotate-180" : "rotate-0")} />
              </Link>
              {aboutOpen && (
                <div className="absolute left-0 top-full pt-2 w-44 z-50">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                    {aboutSubLinks.map((sub) => (
                      <Link key={sub.href} href={sub.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-green-700",
                  pathname.endsWith(link.href) && link.href !== "/" ? "text-green-700" : "text-gray-700"
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
                className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-green-700 whitespace-nowrap"
              >
                <span>{localeFlags[locale]}</span>
                <span>{localeLabels[locale]}</span>
                <ChevronDown className={cn("w-3.5 h-3.5 shrink-0 transition-transform duration-200", langOpen ? "rotate-180" : "rotate-0")} />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                  {routing.locales.map((loc) => (
                    <a
                      key={loc}
                      href={`/${loc}${pathWithoutLocale}`}
                      onClick={() => setLangOpen(false)}
                      className={cn("flex items-center gap-2 px-4 py-2 text-sm hover:bg-green-50 hover:text-green-700", loc === locale ? "text-green-700 font-semibold" : "text-gray-700")}
                    >
                      <span className="text-lg">{localeFlags[loc]}</span>
                      {localeLabels[loc]}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Auth zone */}
            {userInfo ? (
              /* Logged-in: avatar + name → profile link */
              <Link
                href="/profil"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-green-700 transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-green-700 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {userInfo.initial}
                </span>
                <span className="max-w-[120px] truncate">{userInfo.name}</span>
              </Link>
            ) : (
              /* Not logged-in: dropdown with connexion + créer un compte */
              <div ref={authRef} className="relative hidden sm:block">
                <button
                  onClick={() => setAuthOpen(!authOpen)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-green-700 transition-colors"
                >
                  <UserCircle size={20} />
                  {t("connexion")}
                  <ChevronDown size={13} className={cn("transition-transform duration-200", authOpen ? "rotate-180" : "rotate-0")} />
                </button>
                {authOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                    <Link
                      href="/connexion"
                      onClick={() => setAuthOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                    >
                      <LogIn size={15} /> {t("connexion")}
                    </Link>
                    <div className="border-t border-gray-100 my-1" />
                    <Link
                      href="/devenir-membre"
                      onClick={() => setAuthOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-green-700 font-medium hover:bg-green-50 transition-colors"
                    >
                      <UserPlus size={15} /> {t("member")}
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Donate button */}
            <Link
              href="/spenden"
              className="hidden sm:inline-flex items-center px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-full hover:bg-green-800 transition-colors"
            >
              {t("donate")}
            </Link>

            {/* Mobile menu toggle */}
            <button className="lg:hidden text-gray-700" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <nav className="px-4 py-4 flex flex-col gap-3">
            <Link href="/" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-green-700 font-medium py-2">
              {t("home")}
            </Link>

            {/* Mobile about accordion */}
            <div>
              <div className="flex items-center justify-between py-2">
                <Link href="/wer-sind-wir" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-green-700 font-medium">
                  {t("about")}
                </Link>
                <button onClick={() => setMobileAboutOpen(!mobileAboutOpen)} className="text-gray-700 hover:text-green-700 p-1">
                  <ChevronDown size={16} className={cn("transition-transform duration-200", mobileAboutOpen ? "rotate-180" : "rotate-0")} />
                </button>
              </div>
              {mobileAboutOpen && (
                <div className="pl-4 flex flex-col gap-2 pb-2">
                  {aboutSubLinks.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => { setMobileOpen(false); setMobileAboutOpen(false); }}
                      className="text-gray-600 hover:text-green-700 text-sm py-1"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-green-700 font-medium py-2">
                {link.label}
              </Link>
            ))}

            <div className="border-t border-gray-100 pt-3 mt-1 flex flex-col gap-2">
              {userInfo ? (
                <Link
                  href="/profil"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-2 text-gray-700 hover:text-green-700 font-medium"
                >
                  <span className="w-8 h-8 rounded-full bg-green-700 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {userInfo.initial}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{userInfo.name}</p>
                    <p className="text-xs text-gray-400">{t("my_profile")}</p>
                  </div>
                </Link>
              ) : (
                <>
                  <Link
                    href="/connexion"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 py-2 text-gray-700 hover:text-green-700 font-medium text-sm"
                  >
                    <LogIn size={16} /> {t("connexion")}
                  </Link>
                  <Link
                    href="/devenir-membre"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 py-2 text-green-700 font-medium text-sm"
                  >
                    <UserPlus size={16} /> {t("member")}
                  </Link>
                </>
              )}
              <Link
                href="/spenden"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-full hover:bg-green-800"
              >
                {t("donate")}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
