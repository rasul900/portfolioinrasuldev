import type { Skill, ServiceTier, TimelineItem } from "@/types";

export const skills: Skill[] = [
  { name: "React", color: "#61DAFB", accentDark: "#61DAFB", icon: "react", proficiency: 95, years: 5, projects: 40, description: "Component architecture, hooks, performance optimization", featured: true },
  { name: "Next.js", color: "#e8e4df", accentDark: "#c9c5be", icon: "nextjs", proficiency: 92, years: 4, projects: 25, description: "App Router, RSC, SSR, Edge runtime" },
  { name: "Node.js", color: "#68a063", accentDark: "#8fbc88", icon: "nodejs", proficiency: 90, years: 5, projects: 35, description: "REST APIs, microservices, WebSocket" },
  { name: "MongoDB", color: "#47A248", accentDark: "#6fc470", icon: "mongodb", proficiency: 88, years: 4, projects: 20, description: "Aggregation pipelines, indexing, Atlas" },
  { name: "TypeScript", color: "#3178C6", accentDark: "#5a9fd4", icon: "typescript", proficiency: 93, years: 4, projects: 30, description: "Strict mode, generics, type-safe APIs", featured: true },
  { name: "Three.js", color: "#c9cdd3", accentDark: "#e0e4ea", icon: "threejs", proficiency: 85, years: 3, projects: 12, description: "WebGL, shaders, R3F, Drei" },
  { name: "TailwindCSS", color: "#38bdf8", accentDark: "#7dd3fc", icon: "tailwind", proficiency: 95, years: 4, projects: 35, description: "Design systems, CSS variables, responsive", featured: true },
  { name: "Docker", color: "#2496ED", accentDark: "#5ab0f0", icon: "docker", proficiency: 80, years: 3, projects: 15, description: "Containerization, CI/CD pipelines" },
  { name: "Redis", color: "#FF4438", accentDark: "#ff7a72", icon: "redis", proficiency: 82, years: 3, projects: 12, description: "Caching, sessions, pub/sub" },
  { name: "Telegram Bot API", color: "#2CA5E0", accentDark: "#5cbde8", icon: "telegram", proficiency: 95, years: 5, projects: 30, description: "Commerce bots, inline keyboards, payments", featured: true },
  { name: "GraphQL", color: "#E10098", accentDark: "#f04db8", icon: "graphql", proficiency: 78, years: 2, projects: 8, description: "Apollo, schema design, subscriptions" },
  { name: "Express", color: "#d4cfc8", accentDark: "#f0ebe4", icon: "express", proficiency: 88, years: 5, projects: 25, description: "Middleware, routing, authentication" },
];

export const timeline: TimelineItem[] = [
  {
    id: "1",
    role: "Lead Full Stack Developer",
    company: "Freelance / RASUL DEV",
    period: "2021 — Hozir",
    achievements: [
      "50+ loyiha muvaffaqiyatli yetkazildi",
      "Telegram botlar orqali 10k+ foydalanuvchi",
      "Awwwards darajasidagi 3D web tajribalar",
      "E-commerce platformalar Stripe integratsiyasi bilan",
    ],
  },
  {
    id: "2",
    role: "Senior Frontend Developer",
    company: "Tech Startup",
    period: "2019 — 2021",
    achievements: [
      "React/Next.js arxitektura migratsiyasi",
      "Core Web Vitals 40% yaxshilandi",
      "Design system yaratildi va joriy qilindi",
    ],
  },
  {
    id: "3",
    role: "Web Developer",
    company: "Digital Agency",
    period: "2017 — 2019",
    achievements: [
      "20+ mijoz loyihalari",
      "Three.js bilan birinchi 3D loyihalar",
      "GSAP animatsiya standartlari",
    ],
  },
];

export const serviceTiers: ServiceTier[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 500,
    yearlyPrice: 4800,
    description: "Kichik loyihalar va MVP uchun",
    features: [
      "Landing page yoki bot",
      "Responsive dizayn",
      "1 oy qo'llab-quvvatlash",
      "SEO asoslari",
      "Telegram integratsiya",
    ],
    cta: "Boshlash",
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 1500,
    yearlyPrice: 14400,
    description: "To'liq stack loyihalar uchun",
    features: [
      "Full stack web ilova",
      "3D / animatsiya elementlar",
      "Admin panel",
      "3 oy qo'llab-quvvatlash",
      "Performance optimization",
      "Analytics integratsiya",
    ],
    popular: true,
    cta: "Eng mashhur",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: 5000,
    yearlyPrice: 48000,
    description: "Katta biznes va platformalar",
    features: [
      "Custom arxitektura",
      "Real-time analytics",
      "Payment systems",
      "Dedicated support",
      "SLA kafolati",
      "Team training",
    ],
    cta: "Bog'lanish",
  },
];

export const stats = [
  { label: "Proyekt", value: 50, suffix: "+" },
  { label: "Mijoz", value: 30, suffix: "+" },
  { label: "Yil Tajriba", value: 5, suffix: "+" },
  { label: "Telegram Subscriber", value: 10000, suffix: "+" },
];
