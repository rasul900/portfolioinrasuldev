"use client";
import React from "react";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#080808] px-6">
      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,150,0,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,150,0,0.035) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Bottom glow */}
      <div
        className="pointer-events-none absolute bottom-[-60px] left-1/2 -translate-x-1/2"
        style={{
          width: 500,
          height: 220,
          background:
            "radial-gradient(ellipse, rgba(255,140,0,0.1) 0%, transparent 70%)",
        }}
      />

      {/* Floating image */}
      <div
        className="relative z-10 mb-8"
        style={{ animation: "float 3.6s ease-in-out infinite" }}
      >
        <img
          src="/not-found.jpg"
          alt="404 illustration"
          width={200}
          height={200}
          className="object-contain"
          style={{
            filter: "drop-shadow(0 0 36px rgba(255,150,0,0.4))",
          }}
        />
        {/* Shadow under image */}
        <div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full"
          style={{
            width: 110,
            height: 12,
            background:
              "radial-gradient(ellipse, rgba(255,140,0,0.28) 0%, transparent 80%)",
            animation: "shadowAnim 3.6s ease-in-out infinite",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Badge */}
        <div
          className="mb-4 inline-block rounded-full px-4 py-1 text-[11px] font-semibold uppercase tracking-[2.5px]"
          style={{
            background: "rgba(255,150,0,0.1)",
            border: "1px solid rgba(255,150,0,0.28)",
            color: "#ffaa00",
          }}
        >
          Xato 404
        </div>

        {/* 404 number */}
        <h1
          className="mb-1 text-[88px] font-black leading-none tracking-[-4px]"
          style={{
            background: "linear-gradient(160deg, #fff 30%, #555 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </h1>

        {/* Title */}
        <h2 className="mb-2 text-[22px] font-bold tracking-[-0.5px] text-white">
          Sahifa topilmadi
        </h2>

        {/* Subtitle */}
        <p
          className="mx-auto mb-8 max-w-[340px] text-sm leading-relaxed"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          Siz qidirayotgan sahifa yo&apos;q yoki boshqa manzilga
          ko&apos;chirilgan.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-[#0a0a0a] transition-transform hover:scale-105"
            style={{
              background: "#ffaa00",
              boxShadow: "0 0 0 0 rgba(255,160,0,0)",
              transition: "transform 0.18s, box-shadow 0.18s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 28px rgba(255,160,0,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 0 0 rgba(255,160,0,0)";
            }}
          >
            <HomeIcon />
            Bosh sahifaga qaytish
          </Link>

          <button
            onClick={() => history.back()}
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors"
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.4)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color =
                "rgba(255,255,255,0.75)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(255,255,255,0.22)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color =
                "rgba(255,255,255,0.4)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(255,255,255,0.1)";
            }}
          >
            <ArrowLeftIcon />
            Orqaga
          </button>
        </div>

        {/* Dots */}
        <div className="mt-8 flex justify-center gap-2">
          <div className="h-[5px] w-[5px] rounded-full bg-[#ffaa00]" />
          <div
            className="h-[5px] w-[5px] rounded-full"
            style={{ background: "rgba(255,255,255,0.12)" }}
          />
          <div
            className="h-[5px] w-[5px] rounded-full"
            style={{ background: "rgba(255,255,255,0.12)" }}
          />
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes shadowAnim {
          0%, 100% { opacity: 1; transform: translateX(-50%) scaleX(1); }
          50% { opacity: 0.45; transform: translateX(-50%) scaleX(0.65); }
        }
      `}</style>
    </div>
  );
}

function HomeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M3 12L12 3l9 9" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}