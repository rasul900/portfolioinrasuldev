import Image from "next/image";
import { SECTION_BACKGROUNDS, type SectionBackgroundKey } from "@/lib/backgrounds";

type BackdropVariant = "hero" | "section" | "subtle";

interface SectionBackdropProps {
  imageKey: SectionBackgroundKey;
  alt?: string;
  variant?: BackdropVariant;
  priority?: boolean;
  className?: string;
}

export function SectionBackdrop({
  imageKey,
  alt = "",
  variant = "section",
  priority = false,
  className = "",
}: SectionBackdropProps) {
  const src = SECTION_BACKGROUNDS[imageKey];

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden ${className}`} aria-hidden={!alt}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover object-center scale-105"
        sizes="100vw"
      />

      {variant === "hero" && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0908]/94 via-[#0a0908]/60 to-[#0a0908]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0908]/80 via-transparent to-[#0a0908]/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_18%_55%,rgba(201,168,124,0.12)_0%,transparent_65%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_50%_at_82%_48%,rgba(201,168,124,0.14)_0%,transparent_62%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_35%_at_75%_40%,rgba(107,140,174,0.08)_0%,transparent_60%)]" />
        </>
      )}

      {variant === "section" && (
        <>
          <div className="absolute inset-0 bg-[#0a0908]/82" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908]/50 via-[#0a0908]/20 to-[#0a0908]/88" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_25%_15%,rgba(212,180,140,0.07)_0%,transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_70%,rgba(90,120,150,0.05)_0%,transparent_50%)]" />
        </>
      )}

      {variant === "subtle" && (
        <>
          <div className="absolute inset-0 bg-[#0a0908]/88" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0908]/70 via-[#0a0908]/85 to-[#0a0908]/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(201,168,124,0.06)_0%,transparent_70%)]" />
        </>
      )}

      <div className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay bg-[url('/noise.svg')]" />
    </div>
  );
}
