"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X, Check } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_url: string | null;
  locale: string;
  published_at: string | null;
  created_at: string;
};

type FormData = Omit<Article, "id" | "created_at">;

const emptyForm: FormData = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  cover_url: "",
  locale: "de",
  published_at: new Date().toISOString().slice(0, 16),
};

export default function ArticlesClient({ initialData }: { initialData: Article[] }) {
  const [articles, setArticles] = useState<Article[]>(initialData);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
    setError(null);
  }

  function openEdit(article: Article) {
    setEditing(article);
    setForm({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt ?? "",
      content: article.content ?? "",
      cover_url: article.cover_url ?? "",
      locale: article.locale,
      published_at: article.published_at
        ? new Date(article.published_at).toISOString().slice(0, 16)
        : "",
    });
    setShowForm(true);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = editing ? { ...form, id: editing.id } : form;
    const method = editing ? "PUT" : "POST";

    const res = await fetch("/admin/api/articles", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    const saved: Article = await res.json();

    if (editing) {
      setArticles((prev) => prev.map((a) => (a.id === saved.id ? saved : a)));
    } else {
      setArticles((prev) => [saved, ...prev]);
    }

    setShowForm(false);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this article?")) return;
    setDeletingId(id);

    const res = await fetch("/admin/api/articles", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
    }
    setDeletingId(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
          <p className="text-gray-500 text-sm mt-1">{articles.length} total</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> New Article
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">{editing ? "Edit Article" : "New Article"}</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Title" required>
                <input className={inputCls} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
              </Field>
              <Field label="Slug" required>
                <input className={inputCls} value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Locale">
                <select className={inputCls} value={form.locale} onChange={(e) => setForm((f) => ({ ...f, locale: e.target.value }))}>
                  <option value="de">DE</option>
                  <option value="fr">FR</option>
                  <option value="en">EN</option>
                </select>
              </Field>
              <Field label="Published at">
                <input type="datetime-local" className={inputCls} value={form.published_at ?? ""} onChange={(e) => setForm((f) => ({ ...f, published_at: e.target.value }))} />
              </Field>
            </div>
            <Field label="Excerpt">
              <textarea className={inputCls} rows={2} value={form.excerpt ?? ""} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} />
            </Field>
            <Field label="Content">
              <textarea className={inputCls} rows={6} value={form.content ?? ""} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} />
            </Field>
            <Field label="Cover Image">
              <ImageUpload
                value={form.cover_url}
                onChange={(url) => setForm((f) => ({ ...f, cover_url: url }))}
                folder="articles"
              />
            </Field>

            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="flex items-center gap-2 px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-60">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                {editing ? "Save changes" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {articles.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No articles yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Slug</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Locale</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Published</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {articles.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{a.title}</td>
                  <td className="px-4 py-3 text-gray-500">{a.slug}</td>
                  <td className="px-4 py-3">
                    <span className="uppercase text-xs font-semibold bg-gray-100 px-2 py-0.5 rounded">{a.locale}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {a.published_at ? new Date(a.published_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3 flex gap-2 justify-end">
                    <button onClick={() => openEdit(a)} className="p-1.5 text-gray-400 hover:text-green-700 hover:bg-green-50 rounded-lg">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(a.id)} disabled={deletingId === a.id} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-40">
                      {deletingId === a.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
