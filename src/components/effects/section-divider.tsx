"use client";

export function SectionDivider() {
  return (
    <div className="relative h-px w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      <div className="divider-shine absolute inset-0 bg-gradient-to-r from-transparent via-[#c9a87c]/30 to-transparent" />
    </div>
  );
}
