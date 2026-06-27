import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.title,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#050816",
    theme_color: "#2563EB",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
    ],
  };
}
