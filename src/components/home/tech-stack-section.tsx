"use client";

import { useEffect, useRef } from "react";
import { SectionBackdrop } from "@/components/effects/section-backdrop";

const ROW_TOP = [
  { name: "React", icon: "⚛️", color: "#7eb8c9" },
  { name: "Next.js", icon: "▲", color: "#e8e4df" },
  { name: "TypeScript", icon: "TS", color: "#6b8cae" },
  { name: "MongoDB", icon: "🍃", color: "#6fa872" },
  { name: "Three.js", icon: "3D", color: "#c9cdd3" },
  { name: "Node.js", icon: "⬢", color: "#5a9a5e" },
  { name: "TailwindCSS", icon: "〜", color: "#5eb3b8" },
  { name: "WebGL", icon: "GL", color: "#8ab4c7" },
];

const ROW_BOTTOM = [
  { name: "Framer Motion", icon: "◉", color: "#e0dcd6" },
  { name: "GSAP", icon: "G", color: "#9ab86a" },
  { name: "GraphQL", icon: "◈", color: "#c47aa0" },
  { name: "Redis", icon: "◆", color: "#c97a72" },
  { name: "Docker", icon: "🐳", color: "#5a8fb8" },
  { name: "Stripe", icon: "$", color: "#8b85c9" },
  { name: "Telegram API", icon: "✈", color: "#5a9fc9" },
  { name: "Express", icon: "E", color: "#d4cfc8" },
];

function StackCard({ name, icon, color, index }: { name: string; icon: string; color: string; index: number }) {
  return (
    <div className="stack-card" style={{ ["--card-accent" as string]: color, ["--card-i" as string]: index }}>
      <span className="stack-card-icon" aria-hidden="true">{icon}</span>
      <span className="stack-card-name">{name}</span>
    </div>
  );
}

function StackRow({
  items,
  direction,
  rowIndex,
}: {
  items: typeof ROW_TOP;
  direction: "left" | "right";
  rowIndex: number;
}) {
  const doubled = [...items, ...items];

  return (
    <div
      className={`stack-row stack-marquee stack-marquee--${direction}`}
      style={{ ["--row-index" as string]: rowIndex }}
    >
      <div className="stack-marquee-fade stack-marquee-fade--left" aria-hidden="true" />
      <div className="stack-marquee-fade stack-marquee-fade--right" aria-hidden="true" />
      <div className="stack-marquee-track">
        {doubled.map((item, i) => (
          <StackCard key={`${item.name}-${i}`} {...item} index={i % items.length} />
        ))}
      </div>
    </div>
  );
}

export function TechStackSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("stack-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="stack" className="tech-stack-section" aria-label="Tech Stack">
      <SectionBackdrop imageKey="stack" alt="Kod yozish monitori" variant="subtle" />

      <div className="stack-inner relative z-10">
        <header className="stack-header">
          <p className="stack-prompt">
            <span className="stack-prompt-dollar">$</span> cat stack.json
          </p>
          <h2 className="stack-glitch" data-text="> TECH.STACK">
            {"> TECH.STACK"}
            <span className="stack-cursor">|</span>
          </h2>
        </header>

        <div className="stack-marquees">
          <StackRow items={ROW_TOP} direction="left" rowIndex={0} />
          <StackRow items={ROW_BOTTOM} direction="right" rowIndex={1} />
        </div>
      </div>
    </section>
  );
}
