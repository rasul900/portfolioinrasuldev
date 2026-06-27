"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";
import { projects } from "@/data/projects";
import { useUIStore } from "@/store/ui";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionHeader } from "@/components/ui/section-header";
import { ProjectCard } from "@/components/projects/project-card";
import { SPRING } from "@/lib/constants";

export function ProjectsSection() {
  const filter = useUIStore((s) => s.projectFilter);
  const setFilter = useUIStore((s) => s.setProjectFilter);

  const filtered = useMemo(() => {
    let result = [...projects];
    if (filter.category !== "all") result = result.filter((p) => p.category === filter.category);
    if (filter.year !== "all") result = result.filter((p) => p.year.toString() === filter.year);
    if (filter.search) {
      const fuse = new Fuse(result, { keys: ["title", "description", "tech", "category"] });
      result = fuse.search(filter.search).map((r) => r.item);
    }
    return result;
  }, [filter]);

  const categories = ["all", ...new Set(projects.map((p) => p.category))];

  return (
    <AnimatedSection id="projects" background="projects">
      <SectionHeader
        index="04"
        label="Projects"
        title="Selected Works"
        description="Har bir loyiha — real muammo, yechim va natija. Kartani bosing, to'liq case study ochiladi."
      />

      <div className="mb-12 flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Qidirish..."
          value={filter.search}
          onChange={(e) => setFilter({ search: e.target.value })}
          className="premium-card interactive min-w-[200px] flex-1 rounded-full px-5 py-2.5 text-sm outline-none focus:ring-1 focus:ring-[#c9a87c]/50 md:flex-none"
        />
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter({ category: c })}
            className={`interactive rounded-full px-4 py-2 text-xs font-medium tracking-wide uppercase transition-all ${
              filter.category === c
                ? "bg-[#c9a87c] text-[#0a0908] shadow-[0_0_20px_rgba(201,168,124,0.25)]"
                : "premium-card text-slate hover:text-white"
            }`}
          >
            {c === "all" ? "All" : c}
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={SPRING}
              className={i === 0 && filter.category === "all" && !filter.search ? "md:col-span-2" : ""}
            >
              <ProjectCard
                project={project}
                index={i}
                featured={i === 0 && filter.category === "all" && !filter.search}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-slate py-16 text-center">Hech narsa topilmadi.</p>
      )}
    </AnimatedSection>
  );
}
