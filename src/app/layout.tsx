import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { CustomCursor } from "@/components/layout/custom-cursor";
import { Navbar } from "@/components/layout/navbar";
import { CommandPalette } from "@/components/layout/command-palette";
import { CartDrawer } from "@/components/shop/cart-drawer";
import { PWARegister } from "@/components/pwa-register";
import { SITE } from "@/lib/constants";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: SITE.title,
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={`${inter.variable} ${jetbrains.variable} dark h-full`} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/jpeg" href="/logo-navabr.jpg" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: SITE.name,
              url: SITE.url,
              email: SITE.email,
              jobTitle: "Creative Developer",
              address: { "@type": "PostalAddress", addressLocality: "Toshkent", addressCountry: "UZ" },
            }),
          }}
        />
      </head>
      <body className="min-h-full bg-space text-white antialiased">
        <Providers>
          <PWARegister />
          <CustomCursor />
          <Navbar />
          <CommandPalette />
          <CartDrawer />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
