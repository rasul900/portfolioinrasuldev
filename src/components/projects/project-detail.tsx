"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/types";
import { Button } from "@/components/ui/button";
import { SPRING } from "@/lib/constants";
import { Code, ExternalLink, ArrowLeft, ArrowRight } from "lucide-react";

interface ProjectDetailProps {
  project: Project;
  prev?: Project;
  next?: Project;
}

export function ProjectDetail({ project, prev, next }: ProjectDetailProps) {
  return (
    <article>
      <div className="relative min-h-[55vh] md:min-h-[65vh]">
        <Image
          src={project.image}
          alt={project.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908] via-[#0a0908]/55 to-[#0a0908]/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_70%_20%,rgba(245,166,35,0.08)_0%,transparent_60%)]" />

        <div className="absolute inset-x-0 bottom-0 px-6 pb-12 pt-24 md:px-12 md:pb-16 lg:px-20">
          <div className="mx-auto max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.1 }}
              className="mb-4 flex flex-wrap items-center gap-3"
            >
              <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 font-mono text-xs tracking-wider text-[#f5a623] uppercase backdrop-blur-md">
                {project.category}
              </span>
              <span className="font-mono text-xs text-white/45">{project.year}</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.18 }}
              className="font-display max-w-4xl text-4xl font-bold tracking-tight text-[#f5f0e8] md:text-6xl lg:text-7xl"
            >
              {project.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.28 }}
              className="text-slate mt-4 max-w-2xl text-base leading-relaxed md:text-lg"
            >
              {project.description}
            </motion.p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-14 md:px-12 md:py-20 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={SPRING}
          className="grid gap-4 sm:grid-cols-3"
        >
          {project.metrics.map((m) => (
            <div key={m.label} className="premium-card rounded-2xl p-6 text-center">
              <div className="font-display text-3xl font-bold text-[#f5a623] md:text-4xl">
                {m.value}
                {m.suffix}
              </div>
              <div className="text-slate mt-1 text-sm">{m.label}</div>
            </div>
          ))}
        </motion.div>

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {(["problem", "solution", "result"] as const).map((key, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...SPRING, delay: i * 0.08 }}
              className="premium-card rounded-2xl p-6 md:p-7"
            >
              <span className="font-mono text-[10px] tracking-[0.25em] text-[#f5a623]/70 uppercase">
                0{i + 1}
              </span>
              <h2 className="font-display mt-2 mb-3 text-lg font-bold capitalize">{key}</h2>
              <p className="text-slate text-sm leading-relaxed">{project[key]}</p>
            </motion.div>
          ))}
        </div>

        {project.gallery.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h2 className="font-display mb-6 text-2xl font-bold">Gallery</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {project.gallery.map((src, i) => (
                <div key={src} className={`project-gallery-item ${i === 0 && project.gallery.length > 1 ? "md:col-span-2 md:max-h-[420px]" : ""}`}>
                  <Image
                    src={src}
                    alt={`${project.title} screenshot ${i + 1}`}
                    width={1200}
                    height={700}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="mt-10 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          {project.github && (
            <Button variant="secondary" href={project.github}>
              <Code className="h-4 w-4" /> GitHub
            </Button>
          )}
          {project.demo && (
            <Button href={project.demo}>
              <ExternalLink className="h-4 w-4" /> Live Demo
            </Button>
          )}
          <Button variant="ghost" href="/#projects">
            <ArrowLeft className="h-4 w-4" /> Barcha loyihalar
          </Button>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="interactive group flex max-w-[45%] flex-col gap-1 text-slate hover:text-white"
            >
              <span className="flex items-center gap-1 text-xs tracking-wider uppercase">
                <ArrowLeft className="h-3.5 w-3.5" /> Oldingi
              </span>
              <span className="font-display text-sm font-semibold group-hover:text-[#f5a623] md:text-base">
                {prev.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className="interactive group flex max-w-[45%] flex-col items-end gap-1 text-right text-slate hover:text-white"
            >
              <span className="flex items-center gap-1 text-xs tracking-wider uppercase">
                Keyingi <ArrowRight className="h-3.5 w-3.5" />
              </span>
              <span className="font-display text-sm font-semibold group-hover:text-[#f5a623] md:text-base">
                {next.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </article>
  );
}
