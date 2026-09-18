"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Award, CalendarDays, Sparkles } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/utils";

const achievements = [
  {
    year: "2024",
    title: "Digital Excellence Award",
    reason: "Murakkab biznes g‘oyasini tezkor va foydalanuvchiga qulay web-platformaga aylantirgani uchun.",
    detail: "Mahsulot dizayni, frontend arxitekturasi va backend integratsiyasini bir butun tajribaga birlashtirdim.",
    image: "/awards/award-code.png",
    number: "01",
    accent: "from-azure/70 to-transparent",
  },
  {
    year: "2023",
    title: "Best Business Solution",
    reason: "Kichik biznes uchun sotuv jarayonlarini avtomatlashtirib, raqamli o‘sishga yordam bergani uchun.",
    detail: "CRM, Telegram avtomatizatsiyasi va analitikani bitta samarali ekotizimga uladim.",
    image: "/awards/award-business.png",
    number: "02",
    accent: "from-glow/70 to-transparent",
  },
  {
    year: "2022",
    title: "Young Tech Innovator",
    reason: "Yosh dasturchilar hamjamiyatida amaliy bilim ulashgani va yangi loyihalarni qo‘llab-quvvatlagani uchun.",
    detail: "Ochiq fikrlash, tajriba almashish va yangi avlod developerlarini ilhomlantirishga e’tibor qaratdim.",
    image: "/awards/award-community.png",
    number: "03",
    accent: "from-azure/50 to-glow/20",
  },
];

export function ServicesSection() {
  const [active, setActive] = useState(0);
  const achievement = achievements[active];

  const changeAchievement = (direction: 1 | -1) => {
    setActive((current) => (current + direction + achievements.length) % achievements.length);
  };

  return (
    <AnimatedSection id="achievements" background="services">
      <SectionHeader
        index="03"
        label="Achievements"
        title="Yutuqlarim"
        description="Har bir yutuq — o‘rganish, jasorat va real natijaga aylangan g‘oyaning hikoyasi."
      />

      <div className="awards-carousel relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c0d10]/80 p-3 shadow-2xl md:p-5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(201,168,124,0.18),transparent_32%),radial-gradient(circle_at_15%_90%,rgba(107,140,174,0.15),transparent_34%)]" />
        <div className="relative grid min-h-[520px] items-stretch gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[340px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/30 lg:min-h-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={achievement.image}
                initial={{ opacity: 0, scale: 1.08, rotate: 2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.96, rotate: -2 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <Image src={achievement.image} alt={achievement.title} fill className="object-cover" priority={active === 0} />
                <div className={cn("absolute inset-0 bg-gradient-to-t", achievement.accent, "via-transparent to-black/20")} />
                <div className="absolute inset-x-6 bottom-6 flex items-end justify-between">
                  <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs tracking-[0.2em] text-white/80 backdrop-blur-md">AWARD / {achievement.number}</span>
                  <Award className="h-10 w-10 text-white/80 drop-shadow-lg" />
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 py-2 text-xs text-white/75 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-glow" /> Featured achievement
            </div>
          </div>

          <div className="flex flex-col justify-between p-4 md:p-8 lg:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.35 }}
              >
                <div className="mb-8 flex items-center gap-3 text-sm text-glow">
                  <CalendarDays className="h-4 w-4" />
                  {achievement.year}
                  <span className="h-px w-12 bg-glow/40" />
                  {achievement.number} / 03
                </div>
                <h3 className="max-w-xl font-display text-4xl font-semibold leading-[1.05] text-white md:text-6xl">{achievement.title}</h3>
                <p className="mt-8 max-w-xl text-xl leading-8 text-white/90">{achievement.reason}</p>
                <p className="text-slate mt-5 max-w-lg text-sm leading-7">{achievement.detail}</p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
              <div className="flex gap-2" aria-label="Achievement slides">
                {achievements.map((item, index) => (
                  <button key={item.number} type="button" onClick={() => setActive(index)} aria-label={`Show ${item.title}`} aria-current={active === index} className={cn("h-1.5 rounded-full transition-all", active === index ? "w-12 bg-glow" : "w-5 bg-white/20 hover:bg-white/50")} />
                ))}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => changeAchievement(-1)} aria-label="Previous achievement" className="interactive flex size-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-glow hover:text-glow"><ArrowLeft className="h-4 w-4" /></button>
                <button type="button" onClick={() => changeAchievement(1)} aria-label="Next achievement" className="interactive flex size-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-glow hover:text-glow"><ArrowRight className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

export { ServicesSection as AchievementsSection };
