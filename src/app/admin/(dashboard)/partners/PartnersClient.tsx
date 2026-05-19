"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X, Check } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

type Partner = {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  order: number;
  created_at: string;
};

type FormData = Omit<Partner, "id" | "created_at">;

const emptyForm: FormData = { name: "", description: "", logo_url: "", website: "", order: 0 };
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

export default function PartnersClient({ initialData }: { initialData: Partner[] }) {
  const [partners, setPartners] = useState<Partner[]>(initialData);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function openCreate() { setEditing(null); setForm(emptyForm); setShowForm(true); setError(null); }
  function openEdit(p: Partner) {
    setEditing(p);
    setForm({ name: p.name, description: p.description ?? "", logo_url: p.logo_url ?? "", website: p.website ?? "", order: p.order });
    setShowForm(true); setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    const payload = editing ? { ...form, id: editing.id } : form;
    const res = await fetch("/admin/api/partners", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) { setError((await res.json()).error ?? "Error"); setLoading(false); return; }
    const saved: Partner = await res.json();
    if (editing) setPartners((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
    else setPartners((prev) => [...prev, saved].sort((a, b) => a.order - b.order));
    setShowForm(false); setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this partner?")) return;
    setDeletingId(id);
    const res = await fetch("/admin/api/partners", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (res.ok) setPartners((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Partners</h1>
          <p className="text-gray-500 text-sm mt-1">{partners.length} total</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium">
          <Plus size={16} /> New Partner
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">{editing ? "Edit Partner" : "New Partner"}</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name" required>
                <input className={inputCls} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
              </Field>
              <Field label="Website">
                <input type="url" className={inputCls} value={form.website ?? ""} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Logo">
                <ImageUpload
                  value={form.logo_url}
                  onChange={(url) => setForm((f) => ({ ...f, logo_url: url }))}
                  folder="partners"
                />
              </Field>
              <Field label="Display order">
                <input type="number" className={inputCls} value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))} />
              </Field>
            </div>
            <Field label="Description">
              <textarea className={inputCls} rows={3} value={form.description ?? ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </Field>
            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button type="submit" disabled={loading} className="flex items-center gap-2 px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-60">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                {editing ? "Save changes" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {partners.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No partners yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Website</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Order</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {partners.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {p.website ? <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline">{p.website}</a> : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{p.order}</td>
                  <td className="px-4 py-3 flex gap-2 justify-end">
                    <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-green-700 hover:bg-green-50 rounded-lg"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(p.id)} disabled={deletingId === p.id} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-40">
                      {deletingId === p.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
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
