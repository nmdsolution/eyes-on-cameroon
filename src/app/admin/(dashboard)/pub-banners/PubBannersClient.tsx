"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X, Check, Image as ImageIcon, Video } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import VideoUpload from "@/components/VideoUpload";

type Banner = {
  id: string;
  title: string | null;
  media_url: string;
  media_type: "image" | "video";
  link_url: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
};

type FormData = Omit<Banner, "id" | "created_at">;

const emptyForm: FormData = {
  title: "",
  media_url: "",
  media_type: "image",
  link_url: "",
  active: true,
  sort_order: 0,
};

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

export default function PubBannersClient({ initialData }: { initialData: Banner[] }) {
  const [banners, setBanners] = useState<Banner[]>(initialData);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
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

  function openEdit(b: Banner) {
    setEditing(b);
    setForm({
      title: b.title ?? "",
      media_url: b.media_url,
      media_type: b.media_type,
      link_url: b.link_url ?? "",
      active: b.active,
      sort_order: b.sort_order,
    });
    setShowForm(true);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = editing ? { ...form, id: editing.id } : form;
    const res = await fetch("/admin/api/pub-banners", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    const saved: Banner = await res.json();
    if (editing) {
      setBanners((prev) => prev.map((b) => (b.id === saved.id ? saved : b)));
    } else {
      setBanners((prev) => [...prev, saved].sort((a, b) => a.sort_order - b.sort_order));
    }
    setShowForm(false);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette bannière ?")) return;
    setDeletingId(id);
    const res = await fetch("/admin/api/pub-banners", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setBanners((prev) => prev.filter((b) => b.id !== id));
    setDeletingId(null);
  }

  async function toggleActive(b: Banner) {
    const res = await fetch("/admin/api/pub-banners", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: b.id, active: !b.active }),
    });
    if (res.ok) {
      const saved: Banner = await res.json();
      setBanners((prev) => prev.map((x) => (x.id === saved.id ? saved : x)));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bannières publicitaires</h1>
          <p className="text-gray-500 text-sm mt-1">{banners.length} bannière(s) — affichées sur la page d&apos;accueil</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium">
          <Plus size={16} /> Nouvelle bannière
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">{editing ? "Modifier la bannière" : "Nouvelle bannière"}</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Titre (optionnel)">
                <input className={inputCls} value={form.title ?? ""} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Ex: Soirée culturelle camerounaise" />
              </Field>
              <Field label="Type de média" required>
                <select className={inputCls} value={form.media_type} onChange={(e) => setForm((f) => ({ ...f, media_type: e.target.value as "image" | "video", media_url: "" }))}>
                  <option value="image">Image</option>
                  <option value="video">Vidéo (URL)</option>
                </select>
              </Field>
            </div>

            {form.media_type === "image" ? (
              <Field label="Image" required>
                <ImageUpload
                  value={form.media_url || null}
                  onChange={(url) => setForm((f) => ({ ...f, media_url: url ?? "" }))}
                  folder="pub-banners"
                />
              </Field>
            ) : (
              <Field label="Vidéo" required>
                <VideoUpload
                  value={form.media_url || null}
                  onChange={(url) => setForm((f) => ({ ...f, media_url: url ?? "" }))}
                  folder="pub-banners"
                />
              </Field>
            )}

            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Lien (clic sur la bannière)">
                <input className={inputCls} value={form.link_url ?? ""} onChange={(e) => setForm((f) => ({ ...f, link_url: e.target.value }))} placeholder="/veranstaltungen" />
              </Field>
              <Field label="Ordre d'affichage">
                <input type="number" className={inputCls} value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))} />
              </Field>
              <Field label="Statut">
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="w-4 h-4 accent-green-600" />
                  <span className="text-sm text-gray-700">Bannière active</span>
                </label>
              </Field>
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Annuler</button>
              <button type="submit" disabled={loading || !form.media_url} className="flex items-center gap-2 px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-60">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                {editing ? "Enregistrer" : "Créer"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {banners.length === 0 ? (
          <div className="text-center text-gray-400 py-16">
            <ImageIcon size={40} className="mx-auto mb-3 opacity-30" />
            <p>Aucune bannière. Créez-en une pour commencer.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Aperçu</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Titre</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Ordre</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Statut</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {banners.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {b.media_type === "image" ? (
                      <img src={b.media_url} alt={b.title ?? ""} className="w-20 h-12 object-cover rounded-lg border border-gray-200" />
                    ) : (
                      <div className="w-20 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                        <Video size={18} className="text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{b.title ?? <span className="text-gray-400 italic">Sans titre</span>}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-gray-100 px-2 py-0.5 rounded uppercase">
                      {b.media_type === "image" ? <ImageIcon size={11} /> : <Video size={11} />}
                      {b.media_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{b.sort_order}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(b)} className={`text-xs font-semibold px-2 py-0.5 rounded-full ${b.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                      {b.active ? "Actif" : "Inactif"}
                    </button>
                  </td>
                  <td className="px-4 py-3 flex gap-2 justify-end">
                    <button onClick={() => openEdit(b)} className="p-1.5 text-gray-400 hover:text-green-700 hover:bg-green-50 rounded-lg"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(b.id)} disabled={deletingId === b.id} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-40">
                      {deletingId === b.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
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
