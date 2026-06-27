"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { Skill } from "@/types";

const SKILL_ICONS: Record<string, string> = {
  react: "⚛️",
  nextjs: "▲",
  nodejs: "🟢",
  mongodb: "🍃",
  typescript: "TS",
  threejs: "3D",
  tailwind: "🌊",
  docker: "🐳",
  redis: "🔴",
  telegram: "✈️",
  graphql: "◈",
  express: "E",
};

interface RingProps {
  proficiency: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  animate: boolean;
  delay: number;
}

function ProficiencyRing({
  proficiency,
  color,
  size = 72,
  strokeWidth = 3,
  animate,
  delay,
}: RingProps) {
  const r = (size - strokeWidth * 2) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const targetOffset = circumference - (proficiency / 100) * circumference;

  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    if (!animate) return;
    const timer = setTimeout(() => setOffset(targetOffset), delay * 1000);
    return () => clearTimeout(timer);
  }, [animate, targetOffset, delay]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
        aria-hidden="true"
      >
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={strokeWidth} opacity={0.12} />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: animate ? "stroke-dashoffset 1.6s cubic-bezier(0.16,1,0.3,1)" : "none",
            filter: `drop-shadow(0 0 4px ${color}66)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[15px] font-medium leading-none text-[#f5f0e8]">{proficiency}%</span>
        <span className="mt-0.5 text-[9px] text-slate">skill</span>
      </div>
    </div>
  );
}

interface SkillsNebulaCardProps {
  skill: Skill;
  index: number;
}

export function SkillsNebulaCard({ skill, index }: SkillsNebulaCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const icon = SKILL_ICONS[skill.icon] ?? skill.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative flex flex-col items-center gap-2.5 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 text-center backdrop-blur-md transition-colors duration-200 hover:border-white/15"
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = `${skill.color}66`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "";
      }}
    >
      <span
        className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: skill.color }}
        aria-hidden="true"
      />

      {skill.featured && (
        <span
          className="absolute top-2.5 right-2.5 rounded-full px-2 py-0.5 text-[9px] font-medium tracking-wider uppercase"
          style={{
            background: `${skill.color}22`,
            color: skill.accentDark,
            border: `0.5px solid ${skill.color}44`,
          }}
        >
          ✦ Top skill
        </span>
      )}

      <motion.div
        className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.06] text-[22px]"
        whileHover={{ scale: 1.12, rotate: -4 }}
        transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
        aria-label={skill.name}
      >
        {icon}
      </motion.div>

      <p className="text-[13px] font-medium leading-tight text-[#f5f0e8]">{skill.name}</p>

      <ProficiencyRing
        proficiency={skill.proficiency}
        color={skill.color}
        animate={inView}
        delay={index * 0.06 + 0.1}
      />

      <div className="flex flex-wrap justify-center gap-1.5">
        {[`${skill.years}y exp`, `${skill.projects} proj`].map((label) => (
          <span
            key={label}
            className="rounded-full border border-white/[0.08] bg-white/[0.05] px-2 py-0.5 text-[10px] text-slate"
          >
            {label}
          </span>
        ))}
      </div>

      <p className="max-h-0 overflow-hidden text-[11px] leading-relaxed text-slate opacity-0 transition-all duration-300 group-hover:max-h-12 group-hover:opacity-100">
        {skill.description}
      </p>
    </motion.div>
  );
}

interface SkillsNebulaGridProps {
  skills: Skill[];
}

export function SkillsNebulaGrid({ skills }: SkillsNebulaGridProps) {
  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}
    >
      {skills.map((skill, i) => (
        <SkillsNebulaCard key={skill.name} skill={skill} index={i} />
      ))}
    </div>
  );
}
