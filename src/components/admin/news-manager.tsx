"use client";

import { FormEvent, useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";

type NewsItem = { _id: string; title: string; text: string; link?: string; image?: string; position: "top" | "bottom" | "side"; active: boolean };

const positionLabels = { top: "Tepa", bottom: "Past", side: "Yon" };

export function NewsManager() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [form, setForm] = useState({ title: "", text: "", link: "", image: "", position: "side" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    fetch("/api/news", { cache: "no-store" }).then((response) => response.json()).then((data) => {
      if (mounted) { setItems(Array.isArray(data) ? data : []); setLoading(false); }
    }).catch(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true); setError("");
    const response = await fetch("/api/news", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await response.json();
    if (!response.ok) setError(data.error ?? "Xatolik yuz berdi");
    else { setItems((current) => [data, ...current]); setForm({ title: "", text: "", link: "", image: "", position: "side" }); }
    setSaving(false);
  }

  async function toggle(item: NewsItem) {
    const response = await fetch("/api/news", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item._id, active: !item.active }) });
    if (response.ok) setItems((current) => current.map((entry) => entry._id === item._id ? { ...entry, active: !entry.active } : entry));
  }

  async function remove(id: string) {
    if (!window.confirm("Bu yangilik o‘chirilsinmi?")) return;
    const response = await fetch("/api/news", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (response.ok) setItems((current) => current.filter((item) => item._id !== id));
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <GlassCard>
        <h2 className="mb-1 font-display text-xl font-semibold">Yangi yangilik</h2>
        <p className="mb-5 text-sm text-slate">Saytga kirganda ko‘rinadigan e’lon yarating.</p>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <input required maxLength={120} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Sarlavha" className="rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm outline-none focus:border-azure" />
          <textarea required maxLength={500} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="Yangilik matni" rows={4} className="resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm outline-none focus:border-azure" />
          <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="Havola (ixtiyoriy)" type="url" className="rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm outline-none focus:border-azure" />
          <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Rasm URL (ixtiyoriy)" type="url" className="rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm outline-none focus:border-azure" />
          <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="rounded-lg border border-white/10 bg-space px-3 py-3 text-sm outline-none focus:border-azure">
            <option value="side">Yon tomonda</option><option value="top">Tepada</option><option value="bottom">Pastda</option>
          </select>
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button disabled={saving} className="rounded-lg bg-azure px-4 py-3 text-sm font-semibold text-white transition hover:bg-azure/80 disabled:opacity-50">{saving ? "Saqlanmoqda..." : "Yangilikni qo‘shish"}</button>
        </form>
      </GlassCard>
      <GlassCard>
        <div className="mb-5 flex items-center justify-between"><h2 className="font-display text-xl font-semibold">Yangiliklar</h2><span className="text-sm text-slate">{items.length} ta</span></div>
        {loading ? <p className="text-sm text-slate">Yuklanmoqda...</p> : items.length === 0 ? <p className="text-sm text-slate">Hozircha yangilik yo‘q.</p> : <div className="flex flex-col gap-3">{items.map((item) => <article key={item._id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4"><div className="flex items-start justify-between gap-4"><div><div className="mb-1 flex flex-wrap items-center gap-2"><h3 className="font-medium">{item.title}</h3><span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate">{positionLabels[item.position]}</span></div><p className="text-sm text-slate">{item.text}</p></div><span className={item.active ? "text-xs text-emerald-300" : "text-xs text-slate"}>{item.active ? "Faol" : "O‘chiq"}</span></div><div className="mt-3 flex gap-2"><button onClick={() => toggle(item)} className="rounded-md border border-white/10 px-3 py-1.5 text-xs hover:bg-white/10">{item.active ? "O‘chirish" : "Yoqish"}</button><button onClick={() => remove(item._id)} className="rounded-md border border-red-400/20 px-3 py-1.5 text-xs text-red-300 hover:bg-red-400/10">O‘chirish</button></div></article>)}</div>}
      </GlassCard>
    </section>
  );
}
