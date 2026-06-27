"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionHeader } from "@/components/ui/section-header";
import { SkillsNebulaGrid } from "@/components/home/skills-nebula-card";
import { skills } from "@/data/skills";
import { SPRING } from "@/lib/constants";

const SkillsCloud3D = dynamic(
  () => import("@/components/three/skills-cloud").then((m) => m.SkillsCloud3D),
  { ssr: false, loading: () => <div className="h-full min-h-[280px] animate-pulse rounded-[2rem] bg-white/5" /> }
);

export function SkillsSection() {
  return (
    <AnimatedSection id="skills" background="skills" className="!overflow-visible">
      <SectionHeader
        index="02"
        label="Skills"
        title="Tech Arsenal"
        description="Kechqurun stolda — har bir texnologiya real loyihalarda sinovdan o'tgan."
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={SPRING}
        className="skill-nebula-cloud relative z-10 mb-10 overflow-hidden rounded-[2rem] md:mb-14"
      >
        <SkillsCloud3D />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0908] to-transparent" />
      </motion.div>

      <div className="relative z-10">
        <SkillsNebulaGrid skills={skills} />
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 mx-auto mt-14 h-px max-w-2xl origin-center bg-gradient-to-r from-transparent via-[#c9a87c]/40 to-transparent"
      />
    </AnimatedSection>
  );
}
