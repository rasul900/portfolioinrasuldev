"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
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

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ ...SPRING, delay: (index % 6) * 0.06 }}
      className={featured ? "md:col-span-2" : ""}
    >
      <Link href={`/projects/${project.slug}`} className="project-card group interactive block">
        <div className={`project-card-inner ${featured ? "project-card-inner--featured" : ""}`}>
          <div className={`project-card-media ${featured ? "h-[340px] md:h-[420px]" : "h-[260px] md:h-[300px]"}`}>
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
      </Link>
    </motion.article>
  );
}
