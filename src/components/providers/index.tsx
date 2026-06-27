"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { SmoothScrollProvider } from "./smooth-scroll";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <SmoothScrollProvider>
          {children}
          <Toaster position="top-right" richColors theme="dark" />
        </SmoothScrollProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
