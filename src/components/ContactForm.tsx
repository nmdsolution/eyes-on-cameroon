"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle } from "lucide-react";

const inputCls =
  "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Une erreur est survenue.");
    } else {
      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <CheckCircle size={48} className="text-green-600" />
        <p className="text-lg font-semibold text-gray-900">Message envoyé !</p>
        <p className="text-sm text-gray-500">Nous vous répondrons dans les meilleurs délais.</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-2 text-sm text-green-700 hover:underline"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            className={inputCls}
            placeholder="Jean Dupont"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            className={inputCls}
            placeholder="jean@exemple.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
          Sujet
        </label>
        <input
          className={inputCls}
          placeholder="Objet de votre message"
          value={form.subject}
          onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          className={inputCls}
          rows={5}
          placeholder="Votre message..."
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          required
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="self-start inline-flex items-center gap-2 px-6 py-3 bg-green-700 hover:bg-green-800 disabled:opacity-60 text-white font-semibold rounded-full transition-colors"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        {loading ? "Envoi..." : "Envoyer le message"}
      </button>
    </form>
  );
}
