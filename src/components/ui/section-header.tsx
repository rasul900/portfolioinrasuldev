"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { SPRING } from "@/lib/constants";

interface SectionHeaderProps {
  index: string;
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  index,
  label,
  title,
  description,
  align = "left",
}: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView || !lineRef.current) return;
    gsap.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power3.out", delay: 0.3 });
  }, [inView]);

  const alignClass = align === "center" ? "text-center items-center mx-auto" : "";

  return (
    <div ref={ref} className={`mb-16 max-w-3xl ${alignClass}`}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={SPRING}
        className="mb-4 flex items-center gap-3"
      >
        <span className="font-mono text-sm text-glow">{index}</span>
        <span className="text-slate text-xs tracking-[0.2em] uppercase">{label}</span>
        <div ref={lineRef} className="h-px flex-1 origin-left bg-gradient-to-r from-[#c9a87c]/50 to-transparent" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ ...SPRING, delay: 0.1 }}
        className="font-display text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl"
      >
        {title.split(" ").map((word, i) => (
          <span key={i} className={i === title.split(" ").length - 1 ? "text-gradient" : ""}>
            {word}{" "}
          </span>
        ))}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...SPRING, delay: 0.2 }}
          className="text-slate mt-5 text-lg leading-relaxed md:text-xl"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
