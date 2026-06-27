"use client";

import { useEffect } from "react";
import { useUIStore } from "@/store/ui";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import { Home, ShoppingBag, FolderOpen, Mail } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function CommandPalette() {
  const open = useUIStore((s) => s.commandOpen);
  const setOpen = useUIStore((s) => s.setCommandOpen);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  const navigate = (href: string) => {
    setOpen(false);
    if (href.startsWith("/#")) {
      const el = document.querySelector(href.replace("/", ""));
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(href);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="glass fixed top-[20%] left-1/2 z-[101] w-full max-w-lg -translate-x-1/2 rounded-2xl border border-white/10 p-2 shadow-2xl"
          >
            <Command label="Command Menu" className="text-white">
              <Command.Input
                placeholder="Qidirish yoki navigatsiya..."
                className="w-full border-none bg-transparent px-4 py-3 text-white outline-none placeholder:text-slate"
              />
              <Command.List className="max-h-72 overflow-y-auto p-2">
                <Command.Empty className="py-6 text-center text-slate">Topilmadi.</Command.Empty>
                <Command.Group heading="Navigatsiya" className="text-slate text-xs [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5">
                  {NAV_LINKS.map((link) => (
                    <Command.Item
                      key={link.href}
                      onSelect={() => navigate(link.href)}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 aria-selected:bg-white/10"
                    >
                      <NavIcon href={link.href} />
                      {link.label}
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function NavIcon({ href }: { href: string }) {
  if (href.includes("shop")) return <ShoppingBag className="h-4 w-4" />;
  if (href.includes("projects")) return <FolderOpen className="h-4 w-4" />;
  if (href.includes("contact")) return <Mail className="h-4 w-4" />;
  return <Home className="h-4 w-4" />;
}
