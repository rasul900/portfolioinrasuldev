import type { Project } from "@/types";

const projectImages = [
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1000&q=85",
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1000&q=85",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&q=85",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&q=85",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&q=85",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1000&q=85",
];

const baseProjects: Project[] = [
  {
    slug: "telegram-commerce-bot", title: "Telegram Commerce Bot", description: "Full-stack e-commerce bot with payment integration and admin panel.", category: "Telegram", year: 2025, tech: ["Node.js", "MongoDB", "Telegram Bot API", "Redis"], image: projectImages[0], github: "https://github.com/rasuldev", demo: "https://t.me/rasuldev", problem: "Mijozlar Telegram orqali tez buyurtma berishni xohlashdi.", solution: "To'liq avtomatlashtirilgan bot + admin dashboard yaratildi.", result: "Buyurtmalar 340% oshdi, javob vaqti 2 daqiqagacha tushdi.", metrics: [{ label: "Buyurtmalar", value: 12000, suffix: "+" }, { label: "Konversiya", value: 28, suffix: "%" }, { label: "Foydalanuvchilar", value: 8500, suffix: "+" }], gallery: [projectImages[0]], price: 18500000, client: "Online savdo kompaniyasi",
  },
  {
    slug: "3d-portfolio-experience", title: "3D Portfolio Experience", description: "Immersive WebGL portfolio with scroll-driven animations.", category: "3D Web", year: 2026, tech: ["Next.js", "Three.js", "GSAP", "Framer Motion"], image: projectImages[1], demo: "https://rasuldev.uz", problem: "Oddiy portfolio ajralib turmas edi.", solution: "Scroll-driven 3D laptop va cinematic loading screen.", result: "Awwwards nomination, 95+ Lighthouse performance.", metrics: [{ label: "Lighthouse", value: 95, suffix: "+" }, { label: "Engagement", value: 4.2, suffix: "min" }, { label: "Bounce rate", value: 18, suffix: "%" }], gallery: [projectImages[1]], price: 24000000, client: "Shaxsiy brend",
  },
  {
    slug: "analytics-dashboard", title: "Real-time Analytics Dashboard", description: "Live metrics dashboard with WebSocket updates and D3 visualizations.", category: "SaaS", year: 2025, tech: ["React", "Recharts", "Socket.io", "MongoDB"], image: projectImages[2], problem: "Biznes real-time ma'lumotlarga ega emas edi.", solution: "WebSocket overlay bilan SWR-powered dashboard.", result: "Qaror qabul qilish vaqti 60% qisqardi.", metrics: [{ label: "Yangilanish", value: 1, suffix: "s" }, { label: "Foydalanuvchilar", value: 45, suffix: "+" }, { label: "ROI", value: 220, suffix: "%" }], gallery: [projectImages[2]], price: 32000000, client: "Tech startup",
  },
  {
    slug: "premium-shop-platform", title: "Premium Shop Platform", description: "Headless e-commerce with Stripe, Cloudinary, and 3D product preview.", category: "E-Commerce", year: 2025, tech: ["Next.js", "Stripe", "MongoDB", "Cloudinary"], image: projectImages[3], problem: "Mavjud platforma sekin va cheklangan edi.", solution: "Edge-optimized shop + admin panel + receipt upload.", result: "Savdo 180% oshdi, checkout conversion 34%.", metrics: [{ label: "Savdo", value: 180, suffix: "%" }, { label: "Conversion", value: 34, suffix: "%" }, { label: "Mahsulotlar", value: 120, suffix: "+" }], gallery: [projectImages[3]], price: 28500000, client: "Fashion retail brendi",
  },
];

const generatedProjects: Project[] = Array.from({ length: 146 }, (_, index) => {
  const number = index + 5;
  const category = ["Web App", "Telegram", "SaaS", "E-Commerce", "Landing Page", "Automation"][index % 6];
  const title = `${category} Project ${String(number).padStart(3, "0")}`;
  const image = projectImages[index % projectImages.length];
  return {
    slug: `${category.toLowerCase().replaceAll(" ", "-")}-${number}`,
    title,
    description: `${category} uchun tezkor, zamonaviy va natijaga yo'naltirilgan digital mahsulot.`,
    category,
    year: 2024 + (index % 3),
    tech: ["Next.js", "TypeScript", index % 2 ? "MongoDB" : "Node.js"],
    image,
    problem: "Biznes jarayoni zamonaviy va qulay raqamli yechimga muhtoj edi.",
    solution: "Foydalanuvchi tajribasi va biznes maqsadlari asosida maxsus platforma yaratildi.",
    result: "Ish jarayoni tezlashdi va mijozlar uchun qulay tajriba yaratildi.",
    metrics: [{ label: "Samaradorlik", value: 40 + (index % 50), suffix: "%" }],
    gallery: [image],
    price: 8000000 + (index % 8) * 2500000,
    client: ["Mahalliy biznes", "Startup jamoasi", "Online do'kon", "Shaxsiy brend"][index % 4],
  };
});

export const projects: Project[] = [...baseProjects, ...generatedProjects];
