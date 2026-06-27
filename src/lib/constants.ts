export const SITE = {
  name: "RASUL DEV",
  title: "RASUL DEV — Creative Developer & Full Stack Architect",
  description:
    "Premium personal brand portfolio. Telegram Bot Developer, Full Stack Developer, Creative Developer, 3D Web Developer.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://rasuldev.uz",
  email: "hello@rasuldev.uz",
  telegram: "https://t.me/rasuldev",
  instagram: "https://instagram.com/rasuldev",
  github: "https://github.com/rasuldev",
  discord: "rasuldev#0001",
  location: "Toshkent, O'zbekiston",
} as const;

export const TYPEWRITER_ROLES = [
  "Telegram Bot Developer",
  "Full Stack Developer",
  "Creative Developer",
  "3D Web Developer",
] as const;

export const NAV_LINKS = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Services", href: "/#services" },
  { label: "Projects", href: "/#projects" },
  { label: "Shop", href: "/shop" },
  { label: "Contact", href: "/#contact" },
] as const;

export const SPRING = { type: "spring" as const, stiffness: 120, damping: 14 };
