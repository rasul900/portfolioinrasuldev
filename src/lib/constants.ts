export const SITE = {
  name: "ABDURASUL DEV",
  title: "ABDURASUL DEV — Creative Developer & Full Stack Architect",
  description:
    "Premium personal brand portfolio. Telegram Bot Developer, Full Stack Developer, Creative Developer, 3D Web Developer.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://rasuldev.uz",
  email: "abdurasulxayrulayev@gmail.com",
  telegram: "https://t.me/rasul_dev_admin",
  instagram: "https://www.instagram.com/_rasul.dev_?igsh=c3Z0ajJtY2c3NjF5",
  github: "https://github.com/rasul900",
  discord: "Hoizrcha yo'q❌",
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
