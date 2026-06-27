"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Turnstile } from "@marsidev/react-turnstile";
import { Send, MessageCircle, Camera, Code, Mail } from "lucide-react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { SectionHeader } from "@/components/ui/section-header";
import { Magnetic } from "@/components/ui/magnetic";
import { Button } from "@/components/ui/button";
import { SITE, SPRING } from "@/lib/constants";
import { toast } from "sonner";

const Map = dynamic(() => import("@/components/contact/map"), { ssr: false });
const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "1x00000000000000000000AA";

const schema = z.object({
  name: z.string().min(2, "Ism kamida 2 harf"),
  email: z.string().email("Email noto'g'ri"),
  message: z.string().min(10, "Xabar kamida 10 harf"),
});

type FormData = z.infer<typeof schema>;

const contacts = [
  { icon: MessageCircle, label: "Telegram", value: "@rasuldev", href: SITE.telegram, hint: "Tez javob", color: "#2CA5E0" },
  { icon: Camera, label: "Instagram", value: "@rasuldev", href: SITE.instagram, hint: "Loyihalar", color: "#E1306C" },
  { icon: Code, label: "GitHub", value: "rasuldev", href: SITE.github, hint: "Kod", color: "#238636" },
  { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}`, hint: "Rasmiy", color: "#3B82F6" },
];

export function ContactSection() {
  const [success, setSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, turnstileToken }),
      });
      if (!res.ok) throw new Error("Failed");
      setSuccess(true);
      reset();
      toast.success("Xabar yuborildi!");
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      toast.error("Xatolik yuz berdi.");
    }
  };

  return (
    <AnimatedSection id="contact" background="contact">
      <SectionHeader
        index="06"
        label="Contact"
        title="Let's Connect"
        description="Loyiha, hamkorlik yoki savol — bir xabar yetarli."
      />

      <div className="mb-6 flex items-center gap-2">
        <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
        <span className="text-sm font-medium text-green-400">Hozir mavjud</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-4">
          {contacts.map((c, i) => (
            <motion.a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ ...SPRING, delay: i * 0.1 }}
              className="interactive group block"
            >
              <div className="premium-card flex items-center gap-5 rounded-2xl p-5">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                  style={{ background: `${c.color}20`, boxShadow: `0 0 20px ${c.color}30` }}
                >
                  <c.icon className="h-5 w-5" style={{ color: c.color }} />
                </div>
                <div>
                  <div className="font-medium">{c.label}</div>
                  <div className="text-slate text-sm">{c.value} — {c.hint}</div>
                </div>
              </div>
            </motion.a>
          ))}
          <div className="premium-card mt-6 h-64 overflow-hidden rounded-2xl">
            <Map />
          </div>
        </div>

        <div className="premium-card rounded-3xl p-8">
          {success ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex h-full flex-col items-center justify-center py-20 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 text-4xl text-green-400"
              >
                ✓
              </motion.div>
              <h3 className="font-display text-2xl font-bold">Rahmat!</h3>
              <p className="text-slate mt-2">Tez orada javob beraman.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {(["name", "email"] as const).map((field) => (
                <div key={field}>
                  <label className="mb-2 block text-xs tracking-wider text-slate uppercase">{field}</label>
                  <input
                    {...register(field)}
                    type={field === "email" ? "email" : "text"}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 outline-none transition-all focus:border-azure/50 focus:ring-1 focus:ring-azure/30"
                  />
                  {errors[field] && <p className="mt-1.5 text-sm text-red-400">{errors[field]?.message}</p>}
                </div>
              ))}
              <div>
                <label className="mb-2 block text-xs tracking-wider text-slate uppercase">Message</label>
                <textarea
                  {...register("message")}
                  rows={5}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 outline-none transition-all focus:border-azure/50 focus:ring-1 focus:ring-azure/30"
                />
                {errors.message && <p className="mt-1.5 text-sm text-red-400">{errors.message.message}</p>}
              </div>
              <div className="flex justify-center">
                <Turnstile siteKey={TURNSTILE_KEY} onSuccess={setTurnstileToken} options={{ theme: "dark" }} />
              </div>
              <Magnetic strength={0.2}>
                <Button type="submit" disabled={isSubmitting || !turnstileToken} className="w-full">
                  <Send className="h-4 w-4" />
                  {isSubmitting ? "Yuborilmoqda..." : "Yuborish"}
                </Button>
              </Magnetic>
            </form>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
}
