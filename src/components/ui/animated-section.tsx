"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SectionBackdrop } from "@/components/effects/section-backdrop";
import type { SectionBackgroundKey } from "@/lib/backgrounds";

interface AnimatedSectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  background?: SectionBackgroundKey;
}

export function AnimatedSection({
  id,
  children,
  className = "",
  background,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      id={id}
      ref={ref}
      className={`relative overflow-hidden px-6 py-28 md:py-36 ${className}`}
    >
      {background && <SectionBackdrop imageKey={background} variant="section" />}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto max-w-7xl"
      >
        {children}
      </motion.div>
    </section>
  );
}
