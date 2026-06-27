"use client";

import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { serviceTiers } from "@/data/skills";
import { useUIStore } from "@/store/ui";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionHeader } from "@/components/ui/section-header";
import { Magnetic } from "@/components/ui/magnetic";
import { Button } from "@/components/ui/button";
import { SPRING, SITE } from "@/lib/constants";
import { Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function ServicesSection() {
  const yearly = useUIStore((s) => s.pricingYearly);
  const toggle = useUIStore((s) => s.togglePricing);

  return (
    <AnimatedSection id="services" background="services">
      <SectionHeader
        index="03"
        label="Services"
        title="Premium Packages"
        description="Har bir tier sizning biznesingiz uchun mo'ljallangan — MVP dan enterprise gacha."
      />

      <div className="mb-14 flex items-center justify-center gap-5">
        <span className={cn("text-sm transition-colors", !yearly ? "text-white" : "text-slate")}>Oylik</span>
        <button
          onClick={toggle}
          className="interactive relative h-8 w-16 rounded-full border border-white/10 bg-white/5"
          aria-label="Toggle pricing"
        >
          <motion.div
            animate={{ x: yearly ? 34 : 4 }}
            className="absolute top-1 h-6 w-6 rounded-full bg-gradient-to-r from-azure to-glow shadow-lg"
            transition={SPRING}
          />
        </button>
        <span className={cn("text-sm transition-colors", yearly ? "text-white" : "text-slate")}>
          Yillik <span className="text-glow font-medium">-20%</span>
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-3 md:gap-8">
        {serviceTiers.map((tier, i) => {
          const price = yearly ? tier.yearlyPrice : tier.monthlyPrice;
          const period = yearly ? "/yil" : "/oy";
          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...SPRING, delay: i * 0.15 }}
              className={cn(tier.popular && "md:-mt-6 md:mb-6")}
            >
              <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} glareEnable glareMaxOpacity={0.1}>
                <div className={cn("premium-card relative h-full rounded-3xl p-8", tier.popular && "popular-border ring-1 ring-azure/20")}>
                  {tier.popular && (
                    <motion.span
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-gradient-to-r from-azure to-glow px-4 py-1.5 text-xs font-bold shadow-lg"
                    >
                      <Zap className="h-3 w-3" /> Popular
                    </motion.span>
                  )}
                  <h3 className="font-display text-2xl font-bold">{tier.name}</h3>
                  <p className="text-slate mt-2 text-sm">{tier.description}</p>
                  <div className="mt-8 mb-8">
                    <span className="font-display text-5xl font-bold text-gradient">${price}</span>
                    <span className="text-slate ml-1">{period}</span>
                  </div>
                  <ul className="mb-8 space-y-3.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-glow" />
                        <span className="text-slate">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Magnetic strength={0.25}>
                    <Button
                      variant={tier.popular ? "primary" : "secondary"}
                      className="w-full"
                      onClick={() => window.open(SITE.telegram, "_blank")}
                    >
                      {tier.cta}
                    </Button>
                  </Magnetic>
                </div>
              </Tilt>
            </motion.div>
          );
        })}
      </div>
    </AnimatedSection>
  );
}
