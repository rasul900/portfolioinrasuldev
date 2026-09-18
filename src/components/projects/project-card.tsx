"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";
import type { Project } from "@/types";
import { SPRING } from "@/lib/constants";
import { ArrowUpRight } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  index: number;
  featured?: boolean;
}

export function ProjectCard({ project, index, featured = false }: ProjectCardProps) {
  const num = String(index + 1).padStart(2, "0");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ ...SPRING, delay: (index % 6) * 0.06 }}
      className={featured ? "md:col-span-2" : ""}
    >
      <button type="button" onClick={() => setIsOpen(true)} className="block w-full text-left">
        <div className={`project-card-inner ${featured ? "project-card-inner--featured" : ""}`}>
          <div className={`project-card-media project-card-media--shape-${index % 4} ${featured ? "h-[340px] md:h-[420px]" : "h-[260px] md:h-[300px]"}`}>
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              sizes={featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
            />
            <div className="project-card-overlay" />
            <span className="project-card-index font-mono">{num}</span>
            <span className="project-card-arrow">
              <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} />
            </span>
          </div>

          <div className="project-card-body">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="project-card-pill">{project.category}</span>
              <span className="project-card-year">{project.year}</span>
            </div>
            <h3 className={`font-display font-bold tracking-tight ${featured ? "text-2xl md:text-3xl" : "text-xl"}`}>
              {project.title}
            </h3>
            <p className="text-slate mt-2 line-clamp-2 text-sm leading-relaxed">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tech.slice(0, featured ? 5 : 3).map((t) => (
                <span key={t} className="project-card-tech">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </button>
    </motion.article>

    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)}>
          <motion.div role="dialog" aria-modal="true" aria-label={project.title} className="premium-card relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] p-5 md:p-8" initial={{ opacity: 0, y: 24, scale: 0.94, rotate: -2 }} animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }} exit={{ opacity: 0, y: 16, scale: 0.96 }} onClick={(event) => event.stopPropagation()}>
            <button type="button" aria-label="Oynani yopish" onClick={() => setIsOpen(false)} className="absolute right-4 top-4 z-10 rounded-full border border-white/15 bg-black/35 p-2 text-white/70 transition-colors hover:text-white"><X className="h-5 w-5" /></button>
            <div className="relative h-52 overflow-hidden rounded-2xl md:h-64"><Image src={project.image} alt={project.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 672px" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" /><span className="absolute bottom-4 left-4 rounded-full bg-[#c9a87c] px-3 py-1 text-xs font-semibold text-[#0a0908]">{project.category}</span></div>
            <div className="mt-6 flex flex-wrap items-start justify-between gap-4"><div><p className="text-glow font-mono text-xs tracking-[0.25em]">{project.year} / {num}</p><h2 className="mt-2 font-display text-3xl font-bold">{project.title}</h2></div><p className="font-display text-2xl font-bold text-glow">{project.price?.toLocaleString("uz-UZ")} so&apos;m</p></div>
            <p className="text-slate mt-4 leading-7">{project.description}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><p className="text-slate text-xs uppercase tracking-wider">Kampaniya</p><p className="mt-2 font-semibold">{project.client}</p></div><div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><p className="text-slate text-xs uppercase tracking-wider">Natija</p><p className="mt-2 font-semibold">{project.result}</p></div></div>
            <div className="mt-6 flex flex-wrap gap-2">{project.tech.map((tech) => <span key={tech} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/65">{tech}</span>)}</div>
            <Link href={`/projects/${project.slug}`} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#c9a87c] px-4 py-2.5 text-sm font-semibold text-[#0a0908] transition-colors hover:bg-[#e1c59d]">To&apos;liq loyiha sahifasi <ArrowUpRight className="h-4 w-4" /></Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
