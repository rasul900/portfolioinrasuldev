"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Sparkles } from "lucide-react";
import { NAV_LINKS, SPRING } from "@/lib/constants";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import { cn } from "@/lib/utils";

function NavLinkItem({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="interactive group relative px-3 py-1.5"
    >
      <span
        className={cn(
          "relative z-10 text-[13px] font-medium tracking-wide transition-colors duration-300",
          active ? "text-white" : "text-slate group-hover:text-white"
        )}
      >
        {label}
      </span>
      {active && (
        <motion.span
          layoutId="nav-active-pill"
          className="absolute inset-0 rounded-full bg-azure/15 ring-1 ring-azure/30"
          transition={SPRING}
        />
      )}
      <span className="absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-glow to-transparent transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const toggleCart = useCartStore((s) => s.toggleCart);
  const setCommandOpen = useUIStore((s) => s.setCommandOpen);

  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const observeSections = useCallback(() => {
    if (!isHome) return;
    const ids = ["home", "about", "skills", "services", "projects", "contact"];
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [isHome]);

  useEffect(() => {
    return observeSections();
  }, [observeSections]);

  const isLinkActive = (href: string) => {
    if (href === "/shop") return pathname.startsWith("/shop");
    if (!isHome) return pathname === href;
    const hash = href.replace("/#", "");
    return activeSection === hash;
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 4, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-0 right-0 left-0 z-50 px-4 pt-4 md:px-6"
    >
      <nav
        className={cn(
          "nav-shell mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl border px-4 py-2.5 transition-all duration-500 md:px-5 md:py-3",
          scrolled
            ? "border-white/10 bg-space/70 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl backdrop-saturate-150"
            : "border-white/[0.06] bg-white/[0.02] backdrop-blur-md"
        )}
      >
        {/* Logo */}
        <Link href="/" className="interactive group flex shrink-0 items-center gap-2.5">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#c9a87c] to-[#a08060] shadow-[0_0_20px_rgba(201,168,124,0.25)] transition-transform duration-300 group-hover:scale-105">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight md:text-xl">
            <span className="text-white">RASUL</span>
            <span className="bg-gradient-to-r from-glow to-azure bg-clip-text text-transparent"> DEV</span>
          </span>
        </Link>

        {/* Desktop links — centered pill */}
        <div className="hidden items-center rounded-full border border-white/[0.06] bg-white/[0.03] px-1 py-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLinkItem
              key={link.href}
              href={link.href}
              label={link.label}
              active={isLinkActive(link.href)}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCommandOpen(true)}
            className="interactive hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate transition-all hover:border-azure/30 hover:bg-azure/10 hover:text-white md:flex"
          >
            <span>Qidirish</span>
            <kbd className="rounded-md border border-white/10 bg-space/80 px-1.5 py-0.5 font-mono text-[10px] text-glow">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={toggleCart}
            className="interactive relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition-all hover:border-azure/40 hover:bg-azure/10 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
            aria-label="Cart"
          >
            <ShoppingBag className="h-4 w-4" />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-azure to-glow px-1 text-[10px] font-bold text-white shadow-lg"
              >
                {itemCount}
              </motion.span>
            )}
          </button>

          <Link
            href="/#contact"
            className="interactive hidden rounded-xl bg-gradient-to-r from-[#c9a87c] to-[#b8956e] px-4 py-2 text-sm font-medium text-[#0a0908] shadow-[0_0_24px_rgba(201,168,124,0.25)] transition-all hover:scale-[1.03] hover:shadow-[var(--glow-blue)] md:block"
          >
            Bog&apos;lanish
          </Link>

          <button
            className="interactive flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Scroll progress line */}
      <motion.div
        className="mx-auto mt-1 h-px max-w-7xl origin-left bg-gradient-to-r from-[#c9a87c] via-[#d4b896] to-transparent"
        style={{ scaleX: scrolled ? 1 : 0 }}
        initial={false}
        animate={{ scaleX: scrolled ? 1 : 0, opacity: scrolled ? 0.6 : 0 }}
        transition={{ duration: 0.4 }}
      />

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={SPRING}
            className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl border border-white/10 bg-space/95 p-4 shadow-2xl backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "interactive block rounded-xl px-4 py-3 text-base font-medium transition-colors",
                      isLinkActive(link.href)
                        ? "bg-azure/15 text-glow"
                        : "text-slate hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/#contact"
                onClick={() => setMobileOpen(false)}
                className="interactive mt-2 block rounded-xl bg-gradient-to-r from-azure to-glow py-3 text-center font-medium text-white"
              >
                Bog&apos;lanish
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
