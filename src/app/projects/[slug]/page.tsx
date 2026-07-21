import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { ProjectDetail } from "@/components/projects/project-detail";
import { Footer } from "@/components/layout/footer";

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return { title: `${project.title} — ABDURASUL DEV`, description: project.description };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const idx = projects.findIndex((p) => p.slug === slug);
  const prev = projects[idx - 1];
  const next = projects[idx + 1];

  return (
    <main className="min-h-screen bg-[#0a0908] pt-20">
      <ProjectDetail project={project} prev={prev} next={next} />
      <Footer />
    </main>
  );
}
