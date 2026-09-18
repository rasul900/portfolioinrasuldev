import Link from "next/link";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/projects/project-card";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "Barcha loyihalar — ABDURASUL DEV",
  description: "Abdurasul tomonidan yaratilgan 150 ta digital loyiha katalogi.",
};

export default function AllProjectsPage() {
  return (
    <main className="min-h-screen bg-[#0a0908] px-5 pt-28 md:px-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/#projects" className="text-slate text-sm transition-colors hover:text-white">← Bosh sahifaga qaytish</Link>
        <header className="mt-12 max-w-3xl">
          <p className="text-glow font-mono text-xs tracking-[0.3em] uppercase">Portfolio / 150 projects</p>
          <h1 className="mt-4 font-display text-5xl font-bold tracking-tight md:text-7xl">Barcha loyihalar</h1>
          <p className="text-slate mt-6 max-w-2xl text-lg leading-8">Har bir loyiha real biznes muammosini yechish uchun yaratilgan. Kartani bosing — narxi, kampaniyasi va case study tafsilotlari ochiladi.</p>
        </header>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}
        </div>
      </div>
      <Footer />
    </main>
  );
}
