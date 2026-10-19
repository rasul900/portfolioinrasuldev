"use client";

import { useEffect, useState } from "react";
import { X, ArrowUpRight, Megaphone } from "lucide-react";

type NewsItem = { _id: string; title: string; text: string; link?: string; image?: string; position: "top" | "bottom" | "side" };

export function NewsAnnouncement() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);

  useEffect(() => { fetch("/api/news").then((response) => response.json()).then((data) => setItems(Array.isArray(data) ? data : [])).catch(() => setItems([])); }, []);
  const item = items.find((entry) => !dismissed.includes(entry._id));
  if (!item) return null;
  const dismiss = () => setDismissed((current) => [...current, item._id]);
  const position = item.position;
  const placement = position === "side" ? "right-4 top-1/2 -translate-y-1/2" : position === "top" ? "left-1/2 top-20 -translate-x-1/2" : "bottom-5 left-1/2 -translate-x-1/2";

  return <aside aria-label="Yangilik e’loni" className={`fixed z-40 w-[min(22rem,calc(100vw-2rem))] animate-in fade-in duration-500 ${placement}`}>
    <div className="relative overflow-hidden rounded-2xl border border-azure/30 bg-[#07101f]/95 p-5 shadow-2xl shadow-azure/10 backdrop-blur-xl">
      <div className="mb-4 flex items-start justify-between gap-3"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-azure"><Megaphone data-icon="inline-start" /> Yangilik</div><button onClick={dismiss} aria-label="E’lonni yopish" className="rounded-full p-1 text-slate transition hover:bg-white/10 hover:text-white"><X data-icon="inline-start" /></button></div>
      {item.image && <img src={item.image} alt="" className="mb-4 aspect-[2/1] w-full rounded-lg object-cover" />}
      <h2 className="font-display text-lg font-semibold text-white">{item.title}</h2><p className="mt-2 text-sm leading-6 text-slate">{item.text}</p>
      {item.link && <a href={item.link} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-azure hover:text-white">Batafsil <ArrowUpRight data-icon="inline-end" /></a>}
    </div>
  </aside>;
}
