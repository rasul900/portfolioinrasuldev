"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SectionBackdrop } from "@/components/effects/section-backdrop";
import { SITE, TYPEWRITER_ROLES } from "@/lib/constants";
import { Camera, ChevronDown, Code, Mail, Send } from "lucide-react";

const SOCIAL = [
  { icon: Send, href: SITE.telegram, label: "Telegram" },
  { icon: Code, href: SITE.github, label: "GitHub" },
  { icon: Camera, href: SITE.instagram, label: "Instagram" },
  { icon: Mail, href: `mailto:${SITE.email}`, label: "Email" },
];

export function HeroSection() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    const els = contentRef.current.querySelectorAll("[data-hero-reveal]");
    gsap.fromTo(
      els,
      { y: 48, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: "power3.out", delay: 4.1 }
    );
  }, []);

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden">
      <div id="home" className="relative min-h-screen">
        <SectionBackdrop imageKey="hero" alt="Kechqurun ish stoli" variant="hero" priority />

        <div
          ref={contentRef}
          className="relative z-10 flex min-h-screen flex-col justify-center px-6 pt-28 pb-24 md:px-14 lg:px-24 xl:px-32"
        >
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,42%)] lg:gap-8 xl:gap-12">
            <div className="max-w-4xl">
              <p
                data-hero-reveal
                className="font-display text-xl font-light tracking-[0.45em] text-white/90 uppercase md:text-xl"
              >
                ABDURASUL
              </p>

              <h1
                data-hero-reveal
                className="font-display mt-1 text-[clamp(4.5rem,14vw,10rem)] leading-[0.88] font-bold tracking-[-0.02em] text-[#f5f0e8]"
              >
                DEV
              </h1>

              <p
                data-hero-reveal
                className="mt-6 text-xs tracking-[0.42em] text-[#d4c4b0]/80 uppercase md:mt-8 md:text-sm"
              >
                {TYPEWRITER_ROLES[2]}
              </p>

              <p
                data-hero-reveal
                className="mt-3 text-[11px] tracking-[0.2em] text-white/45 uppercase md:text-xs"
              >
                {SITE.location} · 50+ Projects · 5+ Years
              </p>

              <div data-hero-reveal className="mt-10 flex flex-wrap items-center gap-4 md:mt-12">
                <Button
                  variant="ghost"
                  href="#projects"
                  className="min-w-[148px] border-white/35 px-8 tracking-[0.18em] uppercase hover:border-[#c9a87c]/60 hover:bg-white/5"
                >
                  Projects
                </Button>
                <Button
                  variant="ghost"
                  href="/shop"
                  className="min-w-[148px] border-white/35 px-8 tracking-[0.18em] uppercase hover:border-[#c9a87c]/60 hover:bg-white/5"
                >
                  Shop
                </Button>
                <Button
                  variant="ghost"
                  href="#contact"
                  className="min-w-[148px] border-white/35 px-8 tracking-[0.18em] uppercase hover:border-[#c9a87c]/60 hover:bg-white/5"
                >
                  Contact
                </Button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 48, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 4.4, duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none relative mx-auto mt-4 flex w-full max-w-[300px] justify-center sm:max-w-[360px] lg:mt-0 lg:mx-0 lg:max-w-none lg:justify-end"
            >
              <div
                aria-hidden
                className="hero-portrait-glow absolute top-[42%] left-1/2 h-[70%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full lg:left-[52%]"
              />
              <div className="hero-portrait-float relative z-10 w-full">
                <Image
                  src="/hero-portrait.png"
                  alt="Abdurasul"
                  width={640}
                  height={640}
                  priority
                  className="hero-portrait-img h-auto w-full max-h-[52vh] object-contain object-center lg:max-h-[72vh]"
                />
              </div>
            </motion.div>
          </div>

          <div
            data-hero-reveal
            className="absolute bottom-8 left-6 flex items-center gap-5 md:bottom-10 md:left-14 lg:left-24 xl:left-32"
          >
            {SOCIAL.map(({ icon: Icon, href, label }) => (
              <Link
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                aria-label={label}
                className="text-white/45 transition-colors duration-300 hover:text-[#d4b896]"
              >
                <Icon className="h-4 w-4 md:h-[18px] md:w-[18px]" strokeWidth={1.5} />
              </Link>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 5.2, duration: 0.8 }}
            className="absolute right-6 bottom-8 hidden flex-col items-center gap-2 md:flex md:right-14"
          >
            <span className="text-[10px] tracking-[0.3em] text-white/35 uppercase [writing-mode:vertical-rl]">
              Scroll
            </span>
            <ChevronDown className="bounce-arrow h-4 w-4 text-white/35" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
