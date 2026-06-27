"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SITE, NAV_LINKS } from "@/lib/constants";
import { Magnetic } from "@/components/ui/magnetic";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] px-6 py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(37,99,235,0.08)_0%,transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-16 grid gap-12 md:grid-cols-3">
          <div>
            <h3 className="font-display text-3xl font-bold">
              RASUL<span className="text-gradient"> DEV</span>
            </h3>
            <p className="text-slate mt-4 max-w-xs text-sm leading-relaxed">
              Raqamli san&apos;at asari. Premium web tajribalar, 3D, full-stack va creative development.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs tracking-[0.2em] text-slate uppercase">Navigation</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="interactive text-sm text-slate transition-colors hover:text-glow">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs tracking-[0.2em] text-slate uppercase">Social</h4>
            <div className="flex flex-col gap-3">
              {[
                { label: "Telegram", href: SITE.telegram },
                { label: "GitHub", href: SITE.github },
                { label: "Instagram", href: SITE.instagram },
              ].map((s) => (
                <Magnetic key={s.label} strength={0.3}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="interactive flex items-center gap-2 text-sm text-slate transition-colors hover:text-white"
                  >
                    {s.label}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>
        </div>

        <div className="divider-shine h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="mt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-slate text-xs">
            © {new Date().getFullYear()} {SITE.name}. Barcha huquqlar himoyalangan.
          </p>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="font-mono text-xs text-glow"
          >
            Crafted with Three.js + GSAP + Next.js
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
