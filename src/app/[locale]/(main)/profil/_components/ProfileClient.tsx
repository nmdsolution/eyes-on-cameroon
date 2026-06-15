"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  User, Mail, Phone, MapPin, Calendar, LogOut,
  Pencil, CheckCircle, Lock, Eye, EyeOff, KeyRound,
} from "lucide-react";

type Member = {
  first_name: string;
  last_name: string;
  phone?: string | null;
  city?: string | null;
  motivation?: string | null;
  joined_at?: string | null;
};

type Props = {
  user: { id: string; email: string };
  member: Member;
  locale: string;
};

export default function ProfileClient({ user, member, locale }: Props) {
  const t = useTranslations("profile");
  const router = useRouter();
  const supabase = createClient();

  // ── Profile edit ──────────────────────────────────────────────────
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<Member>({ ...member });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    await supabase.from("members").upsert({
      id: user.id,
      first_name: form.first_name,
      last_name: form.last_name,
      phone: form.phone || null,
      city: form.city || null,
      motivation: form.motivation || null,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    router.refresh();
  };

  // ── Password change ───────────────────────────────────────────────
  const [changingPwd, setChangingPwd] = useState(false);
  const [pwdForm, setPwdForm] = useState({ newPwd: "", confirmPwd: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdSaved, setPwdSaved] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);

  const handlePwdChange = async () => {
    if (pwdForm.newPwd.length < 8) {
      setPwdError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (pwdForm.newPwd !== pwdForm.confirmPwd) {
      setPwdError("Les mots de passe ne correspondent pas.");
      return;
    }
    setSavingPwd(true);
    setPwdError(null);
    const { error } = await supabase.auth.updateUser({ password: pwdForm.newPwd });
    setSavingPwd(false);
    if (error) { setPwdError(error.message); return; }
    setChangingPwd(false);
    setPwdForm({ newPwd: "", confirmPwd: "" });
    setPwdSaved(true);
    setTimeout(() => setPwdSaved(false), 3000);
  };

  // ── Logout ────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(`/${locale}`);
    router.refresh();
  };

  // ── Helpers ───────────────────────────────────────────────────────
  const joinedDate = member.joined_at
    ? new Date(member.joined_at).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })
    : null;

  const displayName = [form.first_name, form.last_name].filter(Boolean).join(" ") || user.email;
  const initial = (form.first_name || user.email || "?")[0].toUpperCase();

  const avatarColors = [
    "bg-green-700", "bg-teal-600", "bg-emerald-700",
    "bg-cyan-700", "bg-lime-700",
  ];
  const avatarColor = avatarColors[initial.charCodeAt(0) % avatarColors.length];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* ── Avatar + name header ── */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full ${avatarColor} text-white text-2xl font-bold flex items-center justify-center flex-shrink-0 shadow-md`}>
            {initial}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
            {joinedDate && (
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                <Calendar size={12} /> {t("member_since")} {joinedDate}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-600 transition-colors"
        >
          <LogOut size={15} /> {t("logout")}
        </button>
      </div>

      {/* ── Banners ── */}
      {saved && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-4">
          <CheckCircle size={15} /> {t("saved")}
        </div>
      )}
      {pwdSaved && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-4">
          <CheckCircle size={15} /> Mot de passe mis à jour.
        </div>
      )}

      {/* ── Personal info card ── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-gray-900">{t("personal_info")}</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-sm text-green-700 font-medium hover:underline"
            >
              <Pencil size={13} /> {t("edit")}
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={t("first_name")}>
                <input name="first_name" value={form.first_name} onChange={handleChange}
                  className="input-field" />
              </Field>
              <Field label={t("last_name")}>
                <input name="last_name" value={form.last_name} onChange={handleChange}
                  className="input-field" />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={t("phone")}>
                <input name="phone" value={form.phone ?? ""} onChange={handleChange}
                  className="input-field" placeholder="+49 123 456 789" />
              </Field>
              <Field label={t("city")}>
                <input name="city" value={form.city ?? ""} onChange={handleChange}
                  className="input-field" placeholder="Berlin, Yaoundé…" />
              </Field>
            </div>
            <Field label={t("motivation")}>
              <textarea name="motivation" rows={3} value={form.motivation ?? ""} onChange={handleChange}
                className="input-field resize-none" />
            </Field>
            <div className="flex gap-3 pt-1">
              <button onClick={handleSave} disabled={saving}
                className="px-5 py-2 bg-green-700 text-white text-sm font-semibold rounded-lg hover:bg-green-800 disabled:opacity-60 transition-colors">
                {saving ? "..." : t("save")}
              </button>
              <button onClick={() => { setEditing(false); setForm({ ...member }); }}
                className="px-5 py-2 border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                {t("cancel")}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <InfoRow icon={<Mail size={15} />} label={t("email")} value={user.email} />
            <InfoRow icon={<User size={15} />} label={t("first_name") + " / " + t("last_name")} value={`${form.first_name} ${form.last_name}`.trim() || "—"} />
            <InfoRow icon={<Phone size={15} />} label={t("phone")} value={form.phone || "—"} />
            <InfoRow icon={<MapPin size={15} />} label={t("city")} value={form.city || "—"} />
            {form.motivation && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-400 mb-1">{t("motivation")}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{form.motivation}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Password card ── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <KeyRound size={16} className="text-gray-500" />
            <h2 className="text-base font-bold text-gray-900">Sécurité</h2>
          </div>
          {!changingPwd && (
            <button
              onClick={() => { setChangingPwd(true); setPwdError(null); }}
              className="flex items-center gap-1.5 text-sm text-green-700 font-medium hover:underline"
            >
              <Lock size={13} /> Changer le mot de passe
            </button>
          )}
        </div>

        {changingPwd ? (
          <div className="space-y-4">
            <Field label="Nouveau mot de passe">
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={pwdForm.newPwd}
                  onChange={(e) => setPwdForm((p) => ({ ...p, newPwd: e.target.value }))}
                  placeholder="8 caractères minimum"
                  className="input-field pr-10"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>
            <Field label="Confirmer le mot de passe">
              <input
                type={showPwd ? "text" : "password"}
                value={pwdForm.confirmPwd}
                onChange={(e) => setPwdForm((p) => ({ ...p, confirmPwd: e.target.value }))}
                placeholder="Répéter le nouveau mot de passe"
                className="input-field"
              />
            </Field>
            {pwdError && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{pwdError}</p>
            )}
            <div className="flex gap-3 pt-1">
              <button onClick={handlePwdChange} disabled={savingPwd}
                className="px-5 py-2 bg-green-700 text-white text-sm font-semibold rounded-lg hover:bg-green-800 disabled:opacity-60 transition-colors">
                {savingPwd ? "..." : "Mettre à jour"}
              </button>
              <button onClick={() => { setChangingPwd(false); setPwdError(null); setPwdForm({ newPwd: "", confirmPwd: "" }); }}
                className="px-5 py-2 border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                {t("cancel")}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400">••••••••••••</p>
        )}
      </div>

      {/* Tailwind inline styles for inputs */}
      <style>{`
        .input-field {
          width: 100%;
          padding: 0.625rem 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          outline: none;
          transition: box-shadow 0.15s;
        }
        .input-field:focus {
          box-shadow: 0 0 0 2px #16a34a55;
          border-color: #16a34a;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-gray-400 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}
