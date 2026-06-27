"use client";

import { LoadingScreen } from "@/components/home/loading-screen";
import { HeroSection } from "@/components/home/hero-section";
import { TechStackSection } from "@/components/home/tech-stack-section";
import { AboutSection } from "@/components/home/about-section";
import { SkillsSection } from "@/components/home/skills-section";
import { ServicesSection } from "@/components/home/services-section";
import { ProjectsSection } from "@/components/home/projects-section";
import { ContactSection } from "@/components/home/contact-section";
import { AnalyticsSection } from "@/components/home/analytics-section";
import { TechMarquee } from "@/components/home/tech-marquee";
import { Footer } from "@/components/layout/footer";
import { SectionDivider } from "@/components/effects/section-divider";

export function HomePageClient() {
  return (
    <>
      <LoadingScreen />
      <HeroSection />
      <TechStackSection />
      <SectionDivider />
      <AboutSection />
      <SectionDivider />
      <SkillsSection />
      <TechMarquee />
      <SectionDivider />
      <ServicesSection />
      <SectionDivider />
      <ProjectsSection />
      <SectionDivider />
      <AnalyticsSection />
      <SectionDivider />
      <ContactSection />
      <Footer />
    </>
  );
}
