"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, MapPin, Calendar, LogOut, Pencil, CheckCircle } from "lucide-react";

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

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<Member>({ ...member });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    await supabase
      .from("members")
      .update({
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone || null,
        city: form.city || null,
        motivation: form.motivation || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
    setSaving(false);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(`/${locale}`);
    router.refresh();
  };

  const joinedDate = member.joined_at
    ? new Date(member.joined_at).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <User size={28} className="text-green-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {form.first_name} {form.last_name}
            </h1>
            {joinedDate && (
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <Calendar size={13} /> {t("member_since")} {joinedDate}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
        >
          <LogOut size={16} /> {t("logout")}
        </button>
      </div>

      {/* Success banner */}
      {saved && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-6">
          <CheckCircle size={16} /> {t("saved")}
        </div>
      )}

      {/* Info card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">{t("personal_info")}</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 text-sm text-green-700 font-medium hover:underline"
            >
              <Pencil size={14} /> {t("edit")}
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{t("first_name")}</label>
                <input name="first_name" value={form.first_name} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{t("last_name")}</label>
                <input name="last_name" value={form.last_name} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{t("phone")}</label>
                <input name="phone" value={form.phone ?? ""} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">{t("city")}</label>
                <input name="city" value={form.city ?? ""} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{t("motivation")}</label>
              <textarea name="motivation" rows={3} value={form.motivation ?? ""} onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} disabled={saving}
                className="px-5 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-lg hover:bg-green-800 disabled:opacity-60 transition-colors">
                {saving ? "..." : t("save")}
              </button>
              <button onClick={() => { setEditing(false); setForm({ ...member }); }}
                className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                {t("cancel")}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <InfoRow icon={<Mail size={16} />} label={t("email")} value={user.email} />
            <InfoRow icon={<User size={16} />} label={t("first_name") + " " + t("last_name")} value={`${form.first_name} ${form.last_name}`} />
            {form.phone && <InfoRow icon={<Phone size={16} />} label={t("phone")} value={form.phone} />}
            {form.city && <InfoRow icon={<MapPin size={16} />} label={t("city")} value={form.city} />}
            {form.motivation && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-1">{t("motivation")}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{form.motivation}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-gray-400">{icon}</div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}
