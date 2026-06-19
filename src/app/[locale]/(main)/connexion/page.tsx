"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const t = useTranslations("login");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (searchParams.get("error") === "auth") {
      setError(t("error"));
    }
  }, [searchParams, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (signInError) {
      setError(t("error"));
      return;
    }

    // Check if admin → redirect to dashboard
    const userId = signInData.user?.id;
    if (userId) {
      const { data: member } = await supabase
        .from("members")
        .select("is_admin")
        .eq("id", userId)
        .single();

      if (member?.is_admin) {
        router.push("/admin");
        router.refresh();
        return;
      }
    }

    const redirect = searchParams.get("redirect") ?? `/${locale}/profil`;
    router.push(redirect);
    router.refresh();
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
          <p className="text-gray-500">{t("subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("email")}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">{t("password")}</label>
              <button type="button" className="text-xs text-green-700 hover:underline">
                {t("forgot")}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-colors disabled:opacity-60"
          >
            {loading ? "..." : t("submit")}
          </button>

          {/* Register link */}
          <p className="text-center text-sm text-gray-500">
            {t("no_account")}{" "}
            <Link href="/devenir-membre" className="text-green-700 font-semibold hover:underline">
              {t("join_link")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
