"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X, Check } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

type Event = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  end_date: string | null;
  location: string | null;
  image_url: string | null;
  locale: string;
  created_at: string;
};

type FormData = Omit<Event, "id" | "created_at">;

const emptyForm: FormData = {
  title: "",
  description: "",
  date: new Date().toISOString().slice(0, 16),
  end_date: "",
  location: "",
  image_url: "",
  locale: "de",
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

export default function EventsClient({ initialData }: { initialData: Event[] }) {
  const [events, setEvents] = useState<Event[]>(initialData);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
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

  function openEdit(ev: Event) {
    setEditing(ev);
    setForm({
      title: ev.title,
      description: ev.description ?? "",
      date: ev.date ? new Date(ev.date).toISOString().slice(0, 16) : "",
      end_date: ev.end_date ? new Date(ev.end_date).toISOString().slice(0, 16) : "",
      location: ev.location ?? "",
      image_url: ev.image_url ?? "",
      locale: ev.locale,
    });
    setShowForm(true);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = editing ? { ...form, id: editing.id } : form;
    const res = await fetch("/admin/api/events", {
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

    const saved: Event = await res.json();
    if (editing) {
      setEvents((prev) => prev.map((e) => (e.id === saved.id ? saved : e)));
    } else {
      setEvents((prev) => [saved, ...prev]);
    }
    setShowForm(false);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return;
    setDeletingId(id);
    const res = await fetch("/admin/api/events", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setEvents((prev) => prev.filter((e) => e.id !== id));
    setDeletingId(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-500 text-sm mt-1">{events.length} total</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium">
          <Plus size={16} /> New Event
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">{editing ? "Edit Event" : "New Event"}</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Title" required>
                <input className={inputCls} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
              </Field>
              <Field label="Location">
                <input className={inputCls} value={form.location ?? ""} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
              </Field>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Start date" required>
                <input type="datetime-local" className={inputCls} value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} required />
              </Field>
              <Field label="End date">
                <input type="datetime-local" className={inputCls} value={form.end_date ?? ""} onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))} />
              </Field>
              <Field label="Locale">
                <select className={inputCls} value={form.locale} onChange={(e) => setForm((f) => ({ ...f, locale: e.target.value }))}>
                  <option value="de">DE</option><option value="fr">FR</option><option value="en">EN</option>
                </select>
              </Field>
            </div>
            <Field label="Description">
              <textarea className={inputCls} rows={3} value={form.description ?? ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </Field>
            <Field label="Event Image">
              <ImageUpload
                value={form.image_url}
                onChange={(url) => setForm((f) => ({ ...f, image_url: url }))}
                folder="events"
              />
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
        {events.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No events yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Location</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Locale</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map((ev) => (
                <tr key={ev.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{ev.title}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(ev.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-gray-500">{ev.location ?? "—"}</td>
                  <td className="px-4 py-3"><span className="uppercase text-xs font-semibold bg-gray-100 px-2 py-0.5 rounded">{ev.locale}</span></td>
                  <td className="px-4 py-3 flex gap-2 justify-end">
                    <button onClick={() => openEdit(ev)} className="p-1.5 text-gray-400 hover:text-green-700 hover:bg-green-50 rounded-lg"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(ev.id)} disabled={deletingId === ev.id} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-40">
                      {deletingId === ev.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
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
