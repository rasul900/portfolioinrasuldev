"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionHeader } from "@/components/ui/section-header";
import { StaggerGrid, StaggerItem } from "@/components/ui/reveal";
import { timeline, stats } from "@/data/skills";
import { SPRING } from "@/lib/constants";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: value,
      duration: 2.5,
      ease: "power3.out",
      onUpdate: () => {
        if (ref.current) ref.current.textContent = Math.round(obj.val).toLocaleString() + suffix;
      },
    });
  }, [inView, value, suffix]);

  return <span ref={ref} className="shimmer-text">0{suffix}</span>;
}

export function AboutSection() {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lineRef.current) return;
    gsap.fromTo(
      lineRef.current,
      { height: 0 },
      {
        height: "100%",
        scrollTrigger: { trigger: "#about", start: "top 60%", end: "bottom 40%", scrub: 1 },
      }
    );
  }, []);

  return (
    <AnimatedSection id="about" background="about">
      <SectionHeader
        index="01"
        label="About"
        title="Professional Identity"
        description="Har bir loyiha — qasddan yaratilgan raqamli san'at asari. 5+ yillik tajriba, 50+ muvaffaqiyatli loyiha."
      />

      <StaggerGrid className="mb-24 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {stats.map((stat) => (
          <StaggerItem key={stat.label}>
            <div className="premium-card rounded-2xl p-6 text-center md:p-8">
              <div className="font-display text-3xl font-bold md:text-5xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-slate mt-3 text-xs tracking-wider uppercase md:text-sm">{stat.label}</div>
            </div>
          </StaggerItem>
        ))}
      </StaggerGrid>

      <div className="relative">
        <div
          ref={lineRef}
          className="absolute top-0 left-6 hidden w-px origin-top bg-gradient-to-b from-azure via-glow to-transparent md:block"
          style={{ height: 0 }}
        />
        <div className="flex flex-col gap-6 md:ml-16 md:gap-8">
          {timeline.map((item, i) => (
            <TimelineCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

function TimelineCard({ item, index }: { item: (typeof timeline)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ ...SPRING, delay: index * 0.12 }}
    >
      <Tilt tiltMaxAngleX={12} tiltMaxAngleY={12} glareEnable glareMaxOpacity={0.15} scale={1.02}>
        <div className="premium-card group rounded-2xl p-6 md:p-8">
          <div className="mb-4 flex items-center gap-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-azure/20 font-mono text-sm text-glow ring-1 ring-azure/30">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="font-mono text-sm text-glow">{item.period}</span>
          </div>
          <h3 className="font-display text-2xl font-bold md:text-3xl">{item.role}</h3>
          <p className="text-slate mt-1">{item.company}</p>
          <ul className="mt-6 space-y-3">
            {item.achievements.map((a) => (
              <li key={a} className="flex items-start gap-3 text-sm text-slate transition-colors group-hover:text-white/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-glow" />
                {a}
              </li>
            ))}
          </ul>
        </div>
      </Tilt>
    </motion.div>
  );
}
