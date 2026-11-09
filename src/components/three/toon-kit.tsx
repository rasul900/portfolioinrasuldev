"use client";

import * as THREE from "three";
import { Outlines } from "@react-three/drei";

/** Shared 3-step gradient so every material shades like a cartoon cel. */
let gradientMap: THREE.DataTexture | null = null;
function getGradientMap() {
  if (gradientMap) return gradientMap;
  const data = new Uint8Array([90, 170, 255]);
  gradientMap = new THREE.DataTexture(data, data.length, 1, THREE.RedFormat);
  gradientMap.minFilter = THREE.NearestFilter;
  gradientMap.magFilter = THREE.NearestFilter;
  gradientMap.generateMipmaps = false;
  gradientMap.needsUpdate = true;
  return gradientMap;
}

export const INK = "#1a1410";

export function Toon({
  color,
  emissive,
  emissiveIntensity = 0,
}: {
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
}) {
  const map = getGradientMap();
  return (
    <meshToonMaterial
      color={color}
      gradientMap={map}
      emissive={emissive ?? "#000000"}
      emissiveIntensity={emissiveIntensity}
    />
  );
}

/** Ink outline that gives meshes the hand-drawn cartoon edge. */
export function Ink({ thickness = 0.035 }: { thickness?: number }) {
  return <Outlines thickness={thickness} color={INK} />;
}

/** Window-wide pointer in -1..1, so 3D characters can look at the cursor anywhere on the page. */
export const windowPointer = { x: 0, y: 0 };
if (typeof window !== "undefined") {
  window.addEventListener(
    "pointermove",
    (e) => {
      windowPointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      windowPointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    },
    { passive: true }
  );
}
