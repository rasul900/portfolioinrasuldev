/** Realistic workspace / evening coding photos (Unsplash) */
export const SECTION_BACKGROUNDS = {
  hero: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=1920&q=85",
  stack: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1920&q=80",
  about: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80",
  skills: "https://images.unsplash.com/photo-1517694712202-8dd79c90245?auto=format&fit=crop&w=1920&q=80",
  services: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1920&q=80",
  projects: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1920&q=80",
  analytics: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&q=80",
  contact: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1920&q=80",
} as const;

export type SectionBackgroundKey = keyof typeof SECTION_BACKGROUNDS;
