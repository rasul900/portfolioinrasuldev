"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const NotFound3D = dynamic(() => import("@/components/three/not-found-3d").then((m) => m.NotFound3D), {
  ssr: false,
});

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6">
      <NotFound3D />
      <div className="relative z-10 text-center">
        <h1 className="font-display text-8xl font-bold text-glow">404</h1>
        <p className="text-slate mt-4 text-lg">Sahifa topilmadi</p>
        <Button href="/" className="mt-8" magnetic>
          Bosh sahifaga qaytish
        </Button>
      </div>
    </div>
  );
}
