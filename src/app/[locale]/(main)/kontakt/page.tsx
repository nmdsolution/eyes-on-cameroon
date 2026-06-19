"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export default function ContactPage() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("sent");
    setForm({ name: "", email: "", subject: "", message: "" });
  }

  return (
    <>
      <section className="relative bg-green-900 text-white overflow-hidden py-6 md:py-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-green-700/40 via-transparent to-transparent" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-block w-10 h-1 rounded-full bg-yellow-400" />
            <span className="text-yellow-300 font-semibold text-sm uppercase tracking-widest">{t("title")}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">{t("subtitle")}</h1>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex h-1.5">
          <div className="flex-1 bg-green-500" /><div className="flex-1 bg-red-600" /><div className="flex-1 bg-yellow-400" />
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Left column - Contact info + Map */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{t("contact_info")}</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-3 rounded-xl"><Mail size={20} className="text-green-700" /></div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Email</p>
                  <a href="mailto:info@eyesoncameroon.de" className="text-gray-800 hover:text-green-700 font-medium">
                    info@eyesoncameroon.de
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-3 rounded-xl"><MapPin size={20} className="text-green-700" /></div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">{t("address")}</p>
                  <p className="text-gray-800 font-medium">Deutschland</p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{t("location")}</h2>
            <div className="w-full h-64 rounded-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2520.0!2d10.0!3d50.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x4202d7e5d0e8d30!2sEyes%20on%20Cameroon!5e0!3m2!1sfr!2sde!4v1699999999999!5m2!1sfr!2sde"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Eyes on Cameroon Location"
              />
            </div>
          </div>
        </div>

        {/* Right column - Form */}
        <div>
          {status === "sent" ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <div className="text-green-600 mb-2"><Send size={40} className="mx-auto" /></div>
              <p className="text-green-800 font-semibold text-lg">{t("success")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("name")}</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t("email")}</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("subject")}</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("message")}</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 text-white font-semibold rounded-full hover:bg-green-800 transition-colors disabled:opacity-60"
              >
                <Send size={16} />
                {status === "sending" ? "..." : t("send")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
